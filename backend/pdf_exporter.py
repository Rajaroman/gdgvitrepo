import io
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_session_pdf_report(
    user_goal: str,
    trajectory: List[Dict[str, Any]],
    rag_sources: List[Dict[str, Any]],
    fact_grounding: Dict[str, Any],
    final_answer: str,
    selected_model: str = "Gemma 4-9B Instruct"
) -> bytes:
    """Generates an official session PDF report using reportlab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=12
    )

    heading2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#2563eb"),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Code'],
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=6
    )

    story = []

    # Title & Header
    story.append(Paragraph("🤖 Gemma 4 Session & Agentic Reasoning Report", title_style))
    story.append(Paragraph(f"<b>Event:</b> Build with Gemma – GDG VIT Chennai | <b>Model:</b> {selected_model}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=12))

    # User Goal
    story.append(Paragraph("🎯 Session User Goal", heading2_style))
    story.append(Paragraph(f"<i>{user_goal}</i>", body_style))
    story.append(Spacer(1, 10))

    # Fact Grounding Summary
    story.append(Paragraph("🛡️ Fact-Grounding & Hallucination Mitigation", heading2_style))
    summary = fact_grounding.get("summary", {})
    grounding_text = (
        f"<b>Total Claims Evaluated:</b> {summary.get('total_claims', 0)} | "
        f"<b>Grounded Claims:</b> <font color='#16a34a'>{summary.get('grounded_count', 0)}</font> | "
        f"<b>Partially Grounded:</b> <font color='#d97706'>{summary.get('partially_grounded_count', 0)}</font> | "
        f"<b>Ungrounded:</b> <font color='#dc2626'>{summary.get('ungrounded_count', 0)}</font>"
    )
    story.append(Paragraph(grounding_text, body_style))
    story.append(Spacer(1, 6))

    # Per-claim table
    claims = fact_grounding.get("claims", [])
    if claims:
        table_data = [["Claim Statement", "Status", "Verification Reason"]]
        for c in claims[:5]:
            status_color = "#16a34a" if c["status"] == "grounded" else ("#d97706" if c["status"] == "partially grounded" else "#dc2626")
            table_data.append([
                Paragraph(c["claim"][:80] + ("..." if len(c["claim"]) > 80 else ""), body_style),
                Paragraph(f"<font color='{status_color}'><b>{c['status'].upper()}</b></font>", body_style),
                Paragraph(c["reason"], body_style)
            ])
        t = Table(table_data, colWidths=[240, 100, 190])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#1e293b')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(t)
        story.append(Spacer(1, 10))

    # Final Answer
    story.append(Paragraph("🎯 Synthesized Final Answer", heading2_style))
    story.append(Paragraph(final_answer.replace('\n', '<br/>'), body_style))
    story.append(Spacer(1, 12))

    # Full ReAct Trajectory
    story.append(Paragraph("🔄 ReAct Trajectory Log (Thought / Action / Observation)", heading2_style))
    for step in trajectory:
        step_header = f"<b>Step {step.get('stepNumber', 1)}</b> (Confidence: {step.get('confidence', 99)}%)"
        story.append(Paragraph(step_header, body_style))
        story.append(Paragraph(f"<b>Thought:</b> {step.get('thought', '')}", body_style))
        
        if step.get('action'):
            act = step['action']
            story.append(Paragraph(f"<b>Action ({act.get('tool')}):</b>", body_style))
            story.append(Paragraph(f"{act.get('args')}", code_style))
            
        if step.get('observation'):
            story.append(Paragraph(f"<b>Observation:</b> {step.get('observation')}", code_style))
        story.append(Spacer(1, 6))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
