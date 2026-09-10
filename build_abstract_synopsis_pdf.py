import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that computes total pages dynamically for footer page numbering."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        if self._pageNumber > 1:
            self.saveState()
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor("#64748b"))
            
            # Running header
            self.drawString(54, 11 * inch - 36, "DineWise AI — Major Project Synopsis")
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "Osmania University / NSAKCET")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)
            
            # Running footer
            self.line(54, 48, 8.5 * inch - 54, 48)
            self.drawString(54, 34, "Department of Computer Science and Engineering")
            self.drawRightString(8.5 * inch - 54, 34, f"Page {self._pageNumber} of {page_count}")
            self.restoreState()

def create_synopsis_pdf(output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles matching user requirements
    # Heading: Font 14, Bold, Underlined
    # Content: Font 12, Tab on every paragraph starting, Line space 1.5 (leading=18)
    
    body_style = ParagraphStyle(
        'AcademicBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        firstLineIndent=28,  # Tab indent on every paragraph start
        spaceAfter=10,
        textColor=colors.HexColor('#0f172a')
    )

    heading_style = ParagraphStyle(
        'AcademicHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=20,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor('#0284c7'),  # Clean academic primary color
        keepWithNext=True
    )

    bullet_style = ParagraphStyle(
        'AcademicBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=17,
        leftIndent=20,
        firstLineIndent=-10,
        spaceAfter=6,
        textColor=colors.HexColor('#1e293b')
    )

    story = []

    # ==========================================
    # COVER PAGE (Matching Sample 1 exactly)
    # ==========================================
    cover_center = ParagraphStyle(
        'CoverCenter',
        parent=styles['Normal'],
        alignment=1, # Center
        textColor=colors.HexColor('#0f172a')
    )

    story.append(Spacer(1, 40))
    story.append(Paragraph('<font size="14">A Major Project Abstract on</font>', cover_center))
    story.append(Spacer(1, 14))
    story.append(Paragraph('<font size="16" color="#0284c7"><b>“DineWise AI: AI-Based Restaurant Recommendation &amp; Customer Behavior Analysis System”</b></font>', cover_center))
    story.append(Spacer(1, 24))
    
    story.append(Paragraph('<font size="12">Submitted to</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="13"><b>OSMANIA UNIVERSITY, Hyderabad</b></font>', cover_center))
    story.append(Spacer(1, 18))
    
    story.append(Paragraph('<font size="11">in partial fulfillment of the requirements for the award of degree</font>', cover_center))
    story.append(Spacer(1, 6))
    story.append(Paragraph('<font size="13"><b>BACHELOR OF ENGINEERING</b></font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="11">in</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="13"><b>COMPUTER SCIENCE AND ENGINEERING</b></font>', cover_center))
    story.append(Spacer(1, 28))

    story.append(Paragraph('<font size="12"><b>Submitted by</b></font>', cover_center))
    story.append(Spacer(1, 10))

    # Authors Table
    author_data = [
        [Paragraph('<b>NADEEM</b>', ParagraphStyle('AName', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=0)), Paragraph('<b>[ROLL NUMBER]</b>', ParagraphStyle('ARoll', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=2))],
        [Paragraph('<b>KAMRAN</b>', ParagraphStyle('AName', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=0)), Paragraph('<b>[ROLL NUMBER]</b>', ParagraphStyle('ARoll', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=2))],
        [Paragraph('<b>ABDUL BARI</b>', ParagraphStyle('AName', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=0)), Paragraph('<b>[ROLL NUMBER]</b>', ParagraphStyle('ARoll', fontName='Helvetica-Bold', fontSize=11, leading=14, alignment=2))]
    ]
    author_table = Table(author_data, colWidths=[200, 180])
    author_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(author_table)
    story.append(Spacer(1, 26))

    story.append(Paragraph('<font size="11">Under the guidance of</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="12"><b>[GUIDE NAME]</b></font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11">Professor of CSE, Dean</font>', cover_center))
    story.append(Spacer(1, 30))

    story.append(Paragraph('<font size="12"><b>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</b></font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="12"><b>NAWAB SHAH ALAM KHAN COLLEGE OF ENGINEERING &amp; TECHNOLOGY</b></font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11"><b>(AUTONOMOUS)</b></font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11">Malakpet, Hyderabad.</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="11"><b>2026-2027</b></font>', cover_center))

    story.append(PageBreak())

    # ==========================================
    # PAGE 2: ABSTRACT & INTRODUCTION
    # ==========================================
    story.append(Paragraph('<u><b>ABSTRACT</b></u>', heading_style))
    story.append(Paragraph(
        "This project presents DineWise AI, an intelligent restaurant recommendation and customer behavior analysis system engineered to resolve dining discovery challenges and cognitive choice overload in urban food landscapes. Traditional restaurant discovery platforms rely primarily on static popularity rankings, distance proximity, and generic filtering, failing to capture evolving user taste profiles, dietary constraints, and behavioral preferences. To address these limitations, DineWise AI introduces a hybrid machine learning recommendation architecture combining Content-Based Filtering via Term Frequency-Inverse Document Frequency (TF-IDF) cosine similarity with Collaborative Filtering powered by an implicit user-restaurant interaction matrix. The system incorporates real-time behavioral telemetry, natural language processing (NLP) for unstructured constraint parsing, and an Explainable AI (XAI) transparent scoring module that articulates recommendation rationale to users. Built on a modern decoupled architecture featuring a Next.js frontend and a high-performance Python FastAPI backend, the platform dynamically clusters users into distinct behavioral dining segments. Experimental offline model evaluations demonstrate that the proposed hybrid formulation (alpha = 0.6, beta = 0.4) achieves a Precision@5 of 0.600, Recall@5 of 0.875, and NDCG@5 of 0.873, substantially outperforming traditional popularity baselines while providing scalable, transparent, and personalized restaurant discovery.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph('<u><b>Keywords</b></u>', heading_style))
    story.append(Paragraph(
        "Recommender Systems, Restaurant Recommendation, Hybrid Filtering, Content-Based Filtering, Collaborative Filtering, Customer Behavior Intelligence, Explainable Artificial Intelligence (XAI), Natural Language Processing (NLP), FastAPI Architecture.",
        body_style
    ))
    story.append(Spacer(1, 10))

    story.append(Paragraph('<u><b>Introduction</b></u>', heading_style))
    story.append(Paragraph(
        "Urban dining ecosystems in major metropolitan regions, such as Hyderabad, encompass thousands of diverse food establishments ranging from heritage culinary landmarks and regional specialty outlets to modern cafes and fine-dining bistros. In this dense landscape, consumers routinely face significant decision fatigue when attempting to locate dining venues aligned with their immediate culinary cravings, dietary regimes, budget constraints, and geographical preferences. While modern online platforms catalog extensive restaurant inventories, their recommendation paradigms remain largely static, over-indexing on generalized popularity metrics and raw distances without truly understanding individual taste preferences.",
        body_style
    ))
    story.append(Paragraph(
        "DineWise AI addresses this technological gap by establishing an end-to-end intelligent dining recommendation and behavioral intelligence platform. By monitoring implicit user interactions—including restaurant views, search queries, bookmarking, and explicit feedback—the system continuously refines individual taste profiles. Integrating content similarity across menu items with collaborative patterns discovered from foodies with overlapping dining habits, DineWise AI delivers personalized, explainable, and context-aware restaurant recommendations in real time.",
        body_style
    ))

    # ==========================================
    # PAGE 3: PROBLEM STATEMENT & EXISTING SYSTEM
    # ==========================================
    story.append(Paragraph('<u><b>Problem Statement</b></u>', heading_style))
    story.append(Paragraph(
        "Existing restaurant discovery platforms suffer from fundamental architectural and algorithmic shortcomings. Primarily, conventional applications rely on rigid, rule-based filtering (such as location radius and aggregate star ratings) that treat all users homogenously, neglecting nuanced personal preferences such as spice tolerance, regional culinary styles, and price-to-quality expectations. Furthermore, popular venues receive disproportionate visibility, creating severe cold-start and long-tail discovery bottlenecks for authentic regional dining spots. Crucially, existing platforms operate as opaque black boxes that fail to explain why a particular restaurant is recommended, eroding consumer trust and failing to adapt to dynamic user behavior changes over time.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph('<u><b>Existing System</b></u>', heading_style))
    story.append(Paragraph(
        "Current practice in dining discovery depends on manual browsing across cluttered directories, unstructured search engine lookups, and subjective reliance on aggregate public ratings. Consumers must manually filter through dozens of disconnected menu cards, read conflicting user reviews, and guess whether an establishment caters to their specific dietary requirements (such as pure vegetarian kitchens or authentic slow dum-cooking techniques). This fragmented process is time-consuming, prone to cognitive fatigue, and devoid of personalized intelligence.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph('<u><b>Disadvantages of Existing System</b></u>', heading_style))
    story.append(Paragraph("• <b>Lack of Taste Personalization:</b> Recommendations rely on city-wide popularity rather than tailored user taste profiles.", bullet_style))
    story.append(Paragraph("• <b>Black-Box Recommendations:</b> Users are given lists without any explainable rationale or transparent scoring breakdown.", bullet_style))
    story.append(Paragraph("• <b>Inability to Parse Complex Natural Language:</b> Search bars fail on unstructured queries such as 'spicy biryani under 500 in Tolichowki'.", bullet_style))
    story.append(Paragraph("• <b>Static Behavioral Modeling:</b> Platforms do not dynamically update user preference vectors based on real-time interaction telemetry.", bullet_style))
    story.append(Paragraph("• <b>Cold-Start & Long-Tail Neglect:</b> Newer and high-quality niche dining spots remain hidden beneath heavily sponsored listings.", bullet_style))

    # ==========================================
    # PAGE 4: PROPOSED SYSTEM & ADVANTAGES
    # ==========================================
    story.append(Paragraph('<u><b>Proposed System</b></u>', heading_style))
    story.append(Paragraph(
        "DineWise AI proposes a comprehensive, multi-tiered recommendation and customer behavior intelligence architecture. The platform combines a responsive Next.js web application with a high-throughput Python FastAPI backend and an advanced hybrid recommendation engine. When a user interacts with the system, their interactions (views, favorites, search inputs, ratings, and recommendation feedback) are recorded into a weighted telemetry log. The Content-Based engine computes TF-IDF cosine similarity across restaurant cuisines, specialties, and dining tags, while the Collaborative engine evaluates user-user neighborhood alignment over the interaction matrix.",
        body_style
    ))
    story.append(Paragraph(
        "The system fuses these scores into an explainable hybrid score: Hybrid Score = 0.6 * Content Score + 0.4 * Collaborative Score. An intelligent NLP parser extracts multi-faceted constraints (cuisine, Hyderabad dining zone, budget ceiling, and dietary classification) with built-in typo tolerance. Furthermore, an administrative business intelligence portal performs customer behavioral clustering and computes real-time offline evaluation metrics (Precision@5, Recall@5, NDCG@5) to ensure high recommendation quality.",
        body_style
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph('<u><b>Advantages of Proposed System</b></u>', heading_style))
    story.append(Paragraph("• <b>Mathematically Balanced Hybrid Engine:</b> Combines content feature affinity (0.6) with collaborative peer behavior (0.4) to mitigate cold-start limitations.", bullet_style))
    story.append(Paragraph("• <b>Grounded Explainable AI (XAI):</b> Provides transparent modal breakdowns displaying exact feature contributions (cuisine, zone, budget, dietary match).", bullet_style))
    story.append(Paragraph("• <b>Natural Language Intent Extraction:</b> Accurately extracts semantic constraints and corrects common culinary typos in search queries.", bullet_style))
    story.append(Paragraph("• <b>Real-Time Adaptive Telemetry:</b> Preference weights recalibrate dynamically upon user actions with visual toast confirmation.", bullet_style))
    story.append(Paragraph("• <b>Customer Behavioral Segmentation:</b> Groups users into actionable segments (e.g., Biryani Enthusiast, Vegetarian Explorer, Premium Diner).", bullet_style))
    story.append(Paragraph("• <b>Production-Grade Decoupled Architecture:</b> Built with high-speed asynchronous FastAPI REST endpoints and responsive Next.js frontend.", bullet_style))

    # ==========================================
    # PAGE 5: SYSTEM ARCHITECTURE & MODULES
    # ==========================================
    story.append(Paragraph('<u><b>System Architecture</b></u>', heading_style))
    story.append(Paragraph(
        "The DineWise AI system architecture is structured as a modular, three-tier decoupled pipeline comprising the Client Presentation Layer (Next.js 14, React, Tailwind CSS), Application & Intelligence Layer (FastAPI, scikit-learn, TF-IDF, matrix collaborative filter, NLP parser), and Persistent Data Storage Layer (Relational Database with structured schemas for restaurants, cuisine categories, users, telemetry logs, favorites, and ratings).",
        body_style
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("The key architectural modules comprise:", body_style))
    story.append(Paragraph("1. <b>Client Interface & Discovery Portal:</b> Interactive homepage carousels, responsive restaurant directory, and comparison matrix.", bullet_style))
    story.append(Paragraph("2. <b>NLP Constraint & Search Parser:</b> Regular-expression and entity extraction module resolving multi-attribute dining queries.", bullet_style))
    story.append(Paragraph("3. <b>Content-Based TF-IDF Engine:</b> Vectorizes restaurant metadata and computes cosine similarity with user preference profiles.", bullet_style))
    story.append(Paragraph("4. <b>Collaborative Interaction Engine:</b> Builds weighted user-item interaction matrices to uncover latent community dining preferences.", bullet_style))
    story.append(Paragraph("5. <b>Hybrid Fusion & Re-Ranking:</b> Weighted linear combination (alpha=0.6, beta=0.4) generating personalized top-N recommendation feeds.", bullet_style))
    story.append(Paragraph("6. <b>Explainable AI (XAI) Engine:</b> Deconstructs hybrid scores into tangible factor percentages to provide clear user rationale.", bullet_style))
    story.append(Paragraph("7. <b>Customer Behavioral Intelligence:</b> Evaluates dining frequency, ticket sizes, and dominant cuisines for admin clustering.", bullet_style))
    story.append(Paragraph("8. <b>Model Offline Evaluation Engine:</b> Benchmarks recommendation algorithms across standard information retrieval metrics.", bullet_style))

    # ==========================================
    # PAGE 6: REQUIREMENTS & CONCLUSION
    # ==========================================
    story.append(Paragraph('<u><b>Software Requirements</b></u>', heading_style))
    story.append(Paragraph("• <b>Operating System:</b> Windows 10/11, Linux (Ubuntu 22.04 LTS), or macOS", bullet_style))
    story.append(Paragraph("• <b>Programming Languages:</b> Python 3.11+, TypeScript / JavaScript (Node.js 18+)", bullet_style))
    story.append(Paragraph("• <b>Backend Framework:</b> FastAPI 0.110+, Uvicorn ASGI Server", bullet_style))
    story.append(Paragraph("• <b>Frontend Framework:</b> Next.js 14 (App Router), React 18, Tailwind CSS", bullet_style))
    story.append(Paragraph("• <b>Machine Learning & Data Stack:</b> scikit-learn 1.4+, pandas 2.2+, NumPy 1.26+", bullet_style))
    story.append(Paragraph("• <b>Database:</b> SQLite (Prototype / Embedded) / PostgreSQL (Production)", bullet_style))
    story.append(Paragraph("• <b>Deployment & Tools:</b> Vercel (Frontend), Render (Backend), Git / GitHub, VS Code", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph('<u><b>Hardware Requirements</b></u>', heading_style))
    story.append(Paragraph("• <b>Processor:</b> Modern Intel Core i3/i5/i7 or AMD Ryzen Multi-Core Processor (2.0 GHz+)", bullet_style))
    story.append(Paragraph("• <b>RAM:</b> Minimum 8 GB (16 GB Recommended for concurrent development)", bullet_style))
    story.append(Paragraph("• <b>Storage:</b> Minimum 256 GB SSD (Solid State Drive) with 10 GB free space", bullet_style))
    story.append(Paragraph("• <b>Network:</b> Broadband Internet connectivity for cloud deployment and live testing", bullet_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph('<u><b>Conclusion</b></u>', heading_style))
    story.append(Paragraph(
        "DineWise AI establishes a robust, mathematically sound, and scalable solution to urban dining discovery. By unifying Content-Based TF-IDF cosine similarity, Collaborative Filtering, and real-time interaction telemetry into a hybrid architecture, the system overcomes traditional popularity biases and cold-start limitations. The inclusion of Explainable AI transparency and natural language search capabilities substantially elevates user trust and engagement. Offline model evaluation confirms significant gains in Precision@5 (0.600), Recall@5 (0.875), and NDCG@5 (0.873). The system has been successfully verified, containerized, and deployed as a permanent public live demo on Vercel and Render.",
        body_style
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Synopsis PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    out_file = r"c:\Users\user\OneDrive\Desktop\client projects\Nadeem\major project\documentation_package\DineWise_AI_Major_Project_Abstract_Synopsis.pdf"
    create_synopsis_pdf(out_file)
