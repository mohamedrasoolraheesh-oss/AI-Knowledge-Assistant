#!/usr/bin/env python3
"""
Script to generate a sample PDF for testing the AI Knowledge Assistant.
Requires: pip install reportlab
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

def create_sample_pdf():
    """Generate a sample PDF file."""
    pdf_path = "data/documents/sample.pdf"
    
    # Create PDF
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='#000000',
        spaceAfter=30
    )
    story.append(Paragraph("Machine Learning Fundamentals", title_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Content
    content = """
    <b>Introduction to Machine Learning</b><br/><br/>
    
    Machine learning is a subset of artificial intelligence that enables systems to learn and improve 
    from experience without being explicitly programmed. This document covers the fundamental concepts 
    and techniques used in modern machine learning applications.<br/><br/>
    
    <b>Key Concepts:</b><br/>
    - Supervised Learning: Learning from labeled data<br/>
    - Unsupervised Learning: Finding patterns in unlabeled data<br/>
    - Reinforcement Learning: Learning through interaction and rewards<br/><br/>
    
    <b>Common Algorithms:</b><br/>
    1. Linear Regression: Predicting continuous values<br/>
    2. Logistic Regression: Classification algorithm<br/>
    3. Decision Trees: Tree-based classification<br/>
    4. Random Forests: Ensemble learning method<br/>
    5. Neural Networks: Deep learning models<br/><br/>
    
    <b>Applications:</b><br/>
    Machine learning is used across various industries including healthcare, finance, retail, 
    transportation, and education. From predictive analytics to natural language processing, 
    ML models power many modern applications.<br/><br/>
    
    <b>Best Practices:</b><br/>
    - Clean and preprocess your data<br/>
    - Split data into training and testing sets<br/>
    - Choose appropriate metrics for evaluation<br/>
    - Avoid overfitting through regularization<br/>
    - Continuously monitor and update models<br/>
    """
    
    story.append(Paragraph(content, styles['BodyText']))
    
    # Build PDF
    doc.build(story)
    print(f"✓ Sample PDF created at: {pdf_path}")

if __name__ == "__main__":
    create_sample_pdf()
