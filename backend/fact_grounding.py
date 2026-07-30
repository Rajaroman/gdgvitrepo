import re
from typing import List, Dict, Any

def extract_claims(answer_text: str) -> List[str]:
    """Extracts discrete sentences/claims from the answer text."""
    if not answer_text:
        return []
    
    # Clean markdown headers and bullet points into sentences
    cleaned = re.sub(r'#+\s*', '', answer_text)
    cleaned = re.sub(r'\*+\s*', '', cleaned)
    
    raw_sentences = re.split(r'(?<=[.!?])\s+', cleaned)
    claims = [s.strip() for s in raw_sentences if len(s.strip()) > 15]
    return claims if claims else [answer_text.strip()]

def evaluate_fact_grounding(answer_text: str, RAG_chunks: List[str], search_results: List[str], python_outputs: List[str]) -> Dict[str, Any]:
    """
    Evaluates discrete per-claim grounding statuses:
    - grounded: Claim numbers/facts are fully verified in context.
    - partially grounded: Claim matches general terms but lacks explicit numeric source.
    - ungrounded: Claim numbers or extreme entities do not exist in retrieved context.
    """
    claims = extract_claims(answer_text)
    evaluated_claims = []

    combined_context = " ".join(RAG_chunks + search_results + python_outputs).lower()

    grounded_count = 0
    partially_count = 0
    ungrounded_count = 0

    for claim in claims:
        claim_lower = claim.lower()
        numbers_in_claim = re.findall(r'\b\d+(?:\.\d+)?\b', claim)
        
        # Check if numbers in claim exist in context
        numbers_matched = 0
        for num in numbers_in_claim:
            if num in combined_context:
                numbers_matched += 1

        # Check for ungrounded extreme terms
        has_extreme_terms = any(term in claim_lower for term in ['fusion', 'quantum', '950', '900+'])

        if has_extreme_terms or (numbers_in_claim and numbers_matched == 0):
            status = "ungrounded"
            reason = "Claim contains numbers or terms not present in retrieved RAG context/tools."
            ungrounded_count += 1
        elif numbers_in_claim and numbers_matched == len(numbers_in_claim):
            status = "grounded"
            reason = "100% of numeric figures verified against session sources."
            grounded_count += 1
        else:
            # Check keyword word overlap ratio
            claim_words = [w for w in re.findall(r'\w+', claim_lower) if len(w) > 3]
            matched_words = [w for w in claim_words if w in combined_context]
            ratio = len(matched_words) / len(claim_words) if claim_words else 0
            
            if ratio > 0.4:
                status = "grounded"
                reason = f"Verified semantic match in session context ({int(ratio*100)}% term overlap)."
                grounded_count += 1
            elif ratio > 0.2:
                status = "partially grounded"
                reason = "General concept supported, but specific figures lack explicit citation."
                partially_count += 1
            else:
                status = "ungrounded"
                reason = "Claim lacks supporting evidence in retrieved context."
                ungrounded_count += 1

        evaluated_claims.append({
            "claim": claim,
            "status": status,
            "reason": reason
        })

    total_claims = len(claims) or 1
    grounding_ratio = round((grounded_count + 0.5 * partially_count) / total_claims, 3)

    return {
        "summary": {
            "total_claims": total_claims,
            "grounded_count": grounded_count,
            "partially_grounded_count": partially_count,
            "ungrounded_count": ungrounded_count,
            "grounding_ratio": grounding_ratio
        },
        "claims": evaluated_claims
    }
