import ast
import sys
import os
import subprocess
import tempfile
import time
from typing import Dict, Any

# Dangerous Python modules and builtins to block prior to execution
BLOCKED_MODULES = {
    'os', 'sys', 'subprocess', 'socket', 'shutil', 'importlib', 
    'pty', 'ctypes', 'signal', 'multiprocessing', 'threading',
    'requests', 'urllib', 'http', 'ftplib', 'builtins'
}

BLOCKED_BUILTINS = {
    'eval', 'exec', '__import__', 'compile', 'input', 'open'
}

class SecurityASTVisitor(ast.NodeVisitor):
    def __init__(self):
        self.errors = []

    def visit_Import(self, node):
        for alias in node.names:
            module_name = alias.name.split('.')[0]
            if module_name in BLOCKED_MODULES:
                self.errors.append(f"Blocked import of module '{alias.name}'")
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module:
            module_name = node.module.split('.')[0]
            if module_name in BLOCKED_MODULES:
                self.errors.append(f"Blocked import from module '{node.module}'")
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            if node.func.id in BLOCKED_BUILTINS:
                self.errors.append(f"Blocked call to restricted function '{node.func.id}()'")
        self.generic_visit(node)

def validate_python_code(code_string: str) -> list:
    """Parses Python AST and returns list of security violations."""
    try:
        tree = ast.parse(code_string)
        visitor = SecurityASTVisitor()
        visitor.visit(tree)
        return visitor.errors
    except SyntaxError as e:
        return [f"SyntaxError: {e.msg} at line {e.lineno}"]
    except Exception as e:
        return [f"AST Parsing Error: {str(e)}"]

def execute_sandboxed_python(code_string: str, timeout_seconds: float = 5.0) -> Dict[str, Any]:
    """Executes Python code in a restricted subprocess with timeout and scratch directory."""
    violations = validate_python_code(code_string)
    if violations:
        return {
            "stdout": "",
            "stderr": f"Security Violation: Code rejected prior to execution.\n" + "\n".join(f"- {v}" for v in violations),
            "returncode": 1,
            "blocked": True,
            "execution_time_ms": 0.0
        }

    start_time = time.time()
    
    # Create isolated temporary scratch directory
    scratch_dir = tempfile.mkdtemp(prefix="gemma_sandbox_")
    script_path = os.path.join(scratch_dir, "script.py")

    # Wrap code with safe imports allowed (math, numpy, pandas, json, re, datetime)
    safe_wrapper = (
        "import sys, math, json, re, datetime\n"
        "try:\n"
        "    import pandas as pd\n"
        "    import numpy as np\n"
        "except ImportError:\n"
        "    pass\n\n"
        + code_string
    )

    with open(script_path, "w", encoding="utf-8") as f:
        f.write(safe_wrapper)

    try:
        proc = subprocess.Popen(
            [sys.executable, script_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=scratch_dir,
            text=True
        )

        stdout, stderr = proc.communicate(timeout=timeout_seconds)
        execution_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "stdout": stdout.strip(),
            "stderr": stderr.strip(),
            "returncode": proc.returncode,
            "blocked": False,
            "execution_time_ms": execution_time_ms
        }

    except subprocess.TimeoutExpired:
        proc.kill()
        proc.communicate()
        return {
            "stdout": "",
            "stderr": f"TimeoutError: Execution exceeded time limit of {timeout_seconds} seconds.",
            "returncode": -1,
            "blocked": True,
            "execution_time_ms": round(timeout_seconds * 1000, 2)
        }
    except Exception as e:
        return {
            "stdout": "",
            "stderr": f"Subprocess Execution Error: {str(e)}",
            "returncode": 1,
            "blocked": False,
            "execution_time_ms": 0.0
        }
    finally:
        # Cleanup script
        try:
            if os.path.exists(script_path):
                os.remove(script_path)
            if os.path.exists(scratch_dir):
                os.rmdir(scratch_dir)
        except Exception:
            pass
