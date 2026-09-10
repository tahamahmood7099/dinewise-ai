import os
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Preformatted
)
from reportlab.pdfgen import canvas

class SlideNumberedCanvas(canvas.Canvas):
    """Canvas that draws academic slide decoration and slide numbers."""
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
            self.draw_slide_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_slide_decorations(self, total_slides):
        self.saveState()
        # Draw background subtle header band on content slides
        if self._pageNumber > 1:
            self.setFillColor(colors.HexColor('#0369a1'))
            self.rect(0, 8.5 * inch - 28, 11 * inch, 28, fill=1, stroke=0)
            self.setFont("Helvetica-Bold", 10)
            self.setFillColor(colors.white)
            self.drawString(36, 8.5 * inch - 18, "DineWise AI — Final Year CSE Major Project")
            self.drawRightString(11 * inch - 36, 8.5 * inch - 18, "Osmania University / NSAKCET")
            
            # Bottom footer band
            self.setStrokeColor(colors.HexColor('#e2e8f0'))
            self.setLineWidth(1)
            self.line(36, 30, 11 * inch - 36, 30)
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor('#64748b'))
            self.drawString(36, 16, "Department of Computer Science and Engineering")
            self.drawRightString(11 * inch - 36, 16, f"Slide {self._pageNumber} of {total_slides}")
        self.restoreState()

def create_presentation_pdf(output_path):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    slide_title = ParagraphStyle(
        'SlideTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        alignment=1, # Center
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=14
    )

    slide_bullet = ParagraphStyle(
        'SlideBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=19,
        leftIndent=24,
        firstLineIndent=-14,
        spaceAfter=9,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell = ParagraphStyle(
        'SlideTableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#0f172a')
    )

    table_cell_bold = ParagraphStyle(
        'SlideTableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#0f172a')
    )

    table_header = ParagraphStyle(
        'SlideTableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.white
    )

    story = []

    # ==========================================
    # SLIDE 1: TITLE SLIDE (Matching Sample 3)
    # ==========================================
    story.append(Spacer(1, 40))
    story.append(Paragraph('<font size="14" color="#64748b">A Major Project Presentation on</font>', ParagraphStyle('S1Sub', alignment=1, leading=18)))
    story.append(Spacer(1, 10))
    story.append(Paragraph('<font size="24" color="#0284c7"><b>DineWise AI: AI-Based Restaurant Recommendation, Condition Assessment &amp; Customer Behavior Analysis System</b></font>', ParagraphStyle('S1Main', alignment=1, leading=30)))
    story.append(Spacer(1, 24))

    # Authors Table
    auth_data = [
        [Paragraph('<b>Students</b>', table_header), Paragraph('<b>Roll No.</b>', table_header)],
        [Paragraph('NADEEM', table_cell_bold), Paragraph('[ROLL NUMBER]', table_cell)],
        [Paragraph('KAMRAN', table_cell_bold), Paragraph('[ROLL NUMBER]', table_cell)],
        [Paragraph('ABDUL BARI', table_cell_bold), Paragraph('[ROLL NUMBER]', table_cell)]
    ]
    t_auth = Table(auth_data, colWidths=[240, 200])
    t_auth.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_auth)
    story.append(Spacer(1, 20))

    story.append(Paragraph('<font size="11">Under the guidance of</font>', ParagraphStyle('S1GuideL', alignment=1, leading=14)))
    story.append(Paragraph('<font size="12"><b>[GUIDE NAME]</b></font>', ParagraphStyle('S1GuideN', alignment=1, leading=16)))
    story.append(Paragraph('<font size="10">Professor of CSE, Dean</font>', ParagraphStyle('S1GuideD', alignment=1, leading=14)))
    story.append(Spacer(1, 8))
    story.append(Paragraph('<font size="10" color="#64748b">Department of CSE | Nawab Shah Alam Khan College of Engineering &amp; Technology (Autonomous), Hyderabad</font>', ParagraphStyle('S1Dept', alignment=1, leading=14)))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 2: ABSTRACT
    # ==========================================
    story.append(Paragraph('<u><b>Abstract</b></u>', slide_title))
    story.append(Paragraph("● <b>AI-Powered Dining Discovery:</b> Intelligent restaurant recommendation system tailored to urban food ecosystems.", slide_bullet))
    story.append(Paragraph("● <b>Hybrid Recommendation Formulation:</b> Combines Content-Based TF-IDF cosine similarity (0.6) with Collaborative Filtering matrix similarity (0.4).", slide_bullet))
    story.append(Paragraph("● <b>Real-Time Behavioral Telemetry:</b> Automatically refines user palate vectors based on weighted views, favorites, ratings, and feedback.", slide_bullet))
    story.append(Paragraph("● <b>Explainable AI (XAI) Transparency:</b> Provides interactive score breakdowns detailing exact factor contributions (Cuisine, Zone, Budget, Diet).", slide_bullet))
    story.append(Paragraph("● <b>Natural Language Intent Parser:</b> Extracts multi-faceted dining constraints from unstructured text with typo tolerance.", slide_bullet))
    story.append(Paragraph("● <b>Offline Empirical Benchmarks:</b> Achieves Precision@5 of 0.600, Recall@5 of 0.875, and NDCG@5 of 0.873 on held-out evaluation sets.", slide_bullet))
    story.append(Paragraph("● <b>Permanent Cloud Deployment:</b> Decoupled Next.js 14 frontend on Vercel and high-throughput Python FastAPI backend on Render.", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 3: INTRODUCTION
    # ==========================================
    story.append(Paragraph('<u><b>Introduction</b></u>', slide_title))
    story.append(Paragraph("● Modern metropolitan dining ecosystems (e.g., Hyderabad) host thousands of diverse eateries across heritage, fine-dining, and street food categories.", slide_bullet))
    story.append(Paragraph("● Consumers face cognitive choice overload, struggling to filter through scattered directories and conflicting online reviews.", slide_bullet))
    story.append(Paragraph("● Existing platforms suffer from static popularity bias, sponsored venue saturation, and lack of genuine taste personalization.", slide_bullet))
    story.append(Paragraph("● <b>DineWise AI Objective:</b> Automate personalized, context-aware, and explainable restaurant recommendations from user behavior.", slide_bullet))
    story.append(Paragraph("● <b>Key Pipeline Stages:</b> User Telemetry → NLP Intent Extraction → TF-IDF Content Match → Matrix Collaborative Filtering → Hybrid Re-Ranking → Grounded XAI Output.", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 4: LITERATURE SURVEY (PART 1)
    # ==========================================
    story.append(Paragraph('<u><b>Literature Survey</b></u>', slide_title))
    lit1_data = [
        [Paragraph('<b>S.No</b>', table_header), Paragraph('<b>Title</b>', table_header), Paragraph('<b>Author &amp; Year</b>', table_header), Paragraph('<b>Description</b>', table_header), Paragraph('<b>Methodology</b>', table_header)],
        [Paragraph('1', table_cell_bold), Paragraph('Collaborative Filtering Recommender Systems', table_cell_bold), Paragraph('M. D. Ekstrand et al.<br/>(2011)', table_cell), Paragraph('Foundational analysis of user-item collaborative filtering algorithms.', table_cell), Paragraph('Neighborhood &amp; Matrix Factorization', table_cell)],
        [Paragraph('2', table_cell_bold), Paragraph('Next Generation Recommender Systems Survey', table_cell_bold), Paragraph('G. Adomavicius et al.<br/>(2005)', table_cell), Paragraph('Taxonomy of content-based, collaborative, and hybrid recommendation architectures.', table_cell), Paragraph('Hybrid Ensemble Classification', table_cell)],
        [Paragraph('3', table_cell_bold), Paragraph('Food Recommender Systems: Factors &amp; Challenges', table_cell_bold), Paragraph('C. Trattner et al.<br/>(2020)', table_cell), Paragraph('Comprehensive survey on domain-specific challenges in food &amp; dining recommendation.', table_cell), Paragraph('Domain-Specific Taste &amp; Nutrition Modeling', table_cell)]
    ]
    t_lit1 = Table(lit1_data, colWidths=[35, 160, 130, 240, 150])
    t_lit1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_lit1)

    story.append(PageBreak())

    # ==========================================
    # SLIDE 5: LITERATURE SURVEY (PART 2)
    # ==========================================
    story.append(Paragraph('<u><b>Literature Survey (contd.)</b></u>', slide_title))
    lit2_data = [
        [Paragraph('<b>S.No</b>', table_header), Paragraph('<b>Title</b>', table_header), Paragraph('<b>Author &amp; Year</b>', table_header), Paragraph('<b>Description</b>', table_header), Paragraph('<b>Methodology</b>', table_header)],
        [Paragraph('4', table_cell_bold), Paragraph('Neural Collaborative Filtering', table_cell_bold), Paragraph('X. He et al.<br/>(2017)', table_cell), Paragraph('Models non-linear user-item interaction signals using deep neural networks.', table_cell), Paragraph('Multi-Layer Perceptron + Generalized Matrix Factorization', table_cell)],
        [Paragraph('5', table_cell_bold), Paragraph('Matrix Factorization Techniques for Recommenders', table_cell_bold), Paragraph('Y. Koren et al.<br/>(2009)', table_cell), Paragraph('Establishes latent factor modeling over user rating matrices.', table_cell), Paragraph('Singular Value Decomposition (SVD)', table_cell)]
    ]
    t_lit2 = Table(lit2_data, colWidths=[35, 160, 130, 240, 150])
    t_lit2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_lit2)

    story.append(PageBreak())

    # ==========================================
    # SLIDE 6: COMPARISON
    # ==========================================
    story.append(Paragraph('<u><b>Comparison: Existing vs. Proposed System</b></u>', slide_title))
    comp_data = [
        [Paragraph('<b>Feature / Parameter</b>', table_header), Paragraph('<b>Existing Food Portals</b>', table_header), Paragraph('<b>DineWise AI (Proposed System)</b>', table_header)],
        [Paragraph('Recommendation Engine', table_cell_bold), Paragraph('Distance radius &amp; sponsored listings', table_cell), Paragraph('Hybrid Machine Learning (0.6 Content + 0.4 Collaborative)', table_cell)],
        [Paragraph('Explainability (XAI)', table_cell_bold), Paragraph('Zero explanation (Opaque black box)', table_cell), Paragraph('Transparent modal showing exact factor percentages &amp; rationale', table_cell)],
        [Paragraph('Query Parsing', table_cell_bold), Paragraph('Rigid keyword matching', table_cell), Paragraph('NLP constraint extraction &amp; typo-tolerant intent parsing', table_cell)],
        [Paragraph('Behavioral Adaptation', table_cell_bold), Paragraph('Static user preference registration', table_cell), Paragraph('Real-time telemetry logging &amp; dynamic weight recalibration', table_cell)],
        [Paragraph('Business Intelligence', table_cell_bold), Paragraph('Internal ad revenue tracking', table_cell), Paragraph('Customer behavioral clustering &amp; live model evaluation metrics', table_cell)]
    ]
    t_comp = Table(comp_data, colWidths=[150, 270, 290])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_comp)

    story.append(PageBreak())

    # ==========================================
    # SLIDE 7: DISADVANTAGES OF EXISTING SYSTEMS
    # ==========================================
    story.append(Paragraph('<u><b>Disadvantages of Existing Systems</b></u>', slide_title))
    story.append(Paragraph("● <b>Lack of Granular Personalization:</b> City-wide aggregate ratings dominate, overlooking individual dietary regimes and taste profiles.", slide_bullet))
    story.append(Paragraph("● <b>Cold-Start &amp; Long-Tail Neglect:</b> High-quality niche and regional dining venues remain invisible beneath heavily advertised chains.", slide_bullet))
    story.append(Paragraph("● <b>Black-Box Decision Making:</b> Users receive no explanation of why a venue was recommended, diminishing consumer trust.", slide_bullet))
    story.append(Paragraph("● <b>Rigid Keyword Search:</b> Search bars fail on multi-faceted queries such as 'spicy biryani under 500 in Tolichowki'.", slide_bullet))
    story.append(Paragraph("● <b>Static Behavioral Modeling:</b> Platforms fail to adjust recommendations dynamically based on immediate user interaction signals.", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 8: ADVANTAGES OF PROPOSED SYSTEM
    # ==========================================
    story.append(Paragraph('<u><b>Advantages of Proposed System (DineWise AI)</b></u>', slide_title))
    story.append(Paragraph("● <b>Mathematically Balanced Hybrid Fusion:</b> Overcomes cold-start via TF-IDF content vectors (0.6) and captures serendipity via collaborative matrix (0.4).", slide_bullet))
    story.append(Paragraph("● <b>Grounded Explainability (XAI):</b> Provides clear user-facing rationale and quantitative feature breakdown percentages.", slide_bullet))
    story.append(Paragraph("● <b>NLP Constraint &amp; Typo Parser:</b> Automatically detects cuisine, Hyderabad dining zone, budget ceiling, and dietary requirements.", slide_bullet))
    story.append(Paragraph("● <b>Real-Time Adaptive Telemetry:</b> Logs views, favorites, ratings, and recommendation feedback to continuously optimize rankings.", slide_bullet))
    story.append(Paragraph("● <b>Customer Behavioral Intelligence:</b> Groups users into actionable dining personas (Biryani Enthusiast, Veg Explorer, Premium Diner, Budget Explorer).", slide_bullet))
    story.append(Paragraph("● <b>Production Cloud Ready:</b> Deployed on permanent high-speed edge infrastructure with sub-50ms inference latency.", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 9: SYSTEM ARCHITECTURE
    # ==========================================
    story.append(Paragraph('<u><b>System Architecture &amp; Dataflow</b></u>', slide_title))
    arch_text = """[ USER INTERACTION / BROWSER ]
       │  (Views, Searches, Favorites, Ratings, Feedback)
       ▼
[ PRESENTATION LAYER — NEXT.JS 14 / REACT ]
       │  (REST API Client / Asynchronous JSON Communication)
       ▼
[ APPLICATION & INTELLIGENCE LAYER — FASTAPI (PYTHON) ]
  ┌─────────────────────────────────────────────────────────────┐
  │  1. NLP Search & Constraint Parser (Entity & Typo Extraction)│
  │  2. Content-Based Engine (TF-IDF Vector Cosine Similarity)  │
  │  3. Collaborative Engine (User-User Interaction Matrix)      │
  │  4. Hybrid Fusion Scorer (0.6 * Content + 0.4 * Collab)     │
  │  5. Explainable AI (XAI) Module (Factor Breakdown Modals)   │
  │  6. Telemetry Logger & Behavioral Segmentation Clustering   │
  │  7. Offline Evaluation Engine (Precision, Recall, NDCG)     │
  └─────────────────────────────────────────────────────────────┘
       │  (SQLAlchemy ORM / Relational Database Queries)
       ▼
[ DATA STORAGE LAYER — SQLITE / POSTGRESQL ]
  (Users, Restaurants, Cuisines, Interactions, Favorites, Ratings)"""
    
    story.append(Preformatted(arch_text, ParagraphStyle('ArchPre', fontName='Courier', fontSize=9, leading=12.5, textColor=colors.HexColor('#0f172a'))))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 10: HARDWARE REQUIREMENTS
    # ==========================================
    story.append(Paragraph('<u><b>Hardware Requirements</b></u>', slide_title))
    story.append(Paragraph("● <b>Processor:</b> Modern Intel Core i3 / i5 / i7 or AMD Ryzen Multi-Core Processor (2.0 GHz+).", slide_bullet))
    story.append(Paragraph("● <b>RAM:</b> Minimum 8 GB (16 GB Recommended for concurrent development & inference).", slide_bullet))
    story.append(Paragraph("● <b>Storage:</b> Minimum 256 GB SSD (Solid State Drive) with at least 10 GB free space.", slide_bullet))
    story.append(Paragraph("● <b>Display:</b> 1080p Full HD Display (1920 x 1080) for optimal UI visualization.", slide_bullet))
    story.append(Paragraph("● <b>Network Connectivity:</b> Broadband Internet connection for cloud hosting and live API communication.", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 11: SOFTWARE REQUIREMENTS
    # ==========================================
    story.append(Paragraph('<u><b>Software Requirements</b></u>', slide_title))
    story.append(Paragraph("● <b>Operating System:</b> Windows 10/11, Linux (Ubuntu 22.04 LTS), or macOS.", slide_bullet))
    story.append(Paragraph("● <b>Programming Languages:</b> Python 3.11+, TypeScript / JavaScript (Node.js 18+).", slide_bullet))
    story.append(Paragraph("● <b>Backend Framework:</b> FastAPI 0.110+, Uvicorn ASGI Server.", slide_bullet))
    story.append(Paragraph("● <b>Frontend Framework:</b> Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons.", slide_bullet))
    story.append(Paragraph("● <b>Machine Learning Stack:</b> scikit-learn 1.4+, pandas 2.2+, NumPy 1.26+.", slide_bullet))
    story.append(Paragraph("● <b>Database:</b> SQLite 3 (Embedded / Prototype) / PostgreSQL (Production).", slide_bullet))
    story.append(Paragraph("● <b>Deployment & Tools:</b> Vercel (Frontend), Render (Backend), Git / GitHub, VS Code.", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 12: EVALUATION & BENCHMARKS
    # ==========================================
    story.append(Paragraph('<u><b>Offline Evaluation &amp; Benchmark Results</b></u>', slide_title))
    bench_data = [
        [Paragraph('<b>Recommendation Model</b>', table_header), Paragraph('<b>Precision@5</b>', table_header), Paragraph('<b>Recall@5</b>', table_header), Paragraph('<b>F1-Score</b>', table_header), Paragraph('<b>NDCG@5</b>', table_header), Paragraph('<b>Catalog Coverage</b>', table_header)],
        [Paragraph('Popularity Baseline', table_cell_bold), Paragraph('0.400', table_cell), Paragraph('0.583', table_cell), Paragraph('0.475', table_cell), Paragraph('0.534', table_cell), Paragraph('100.0%', table_cell)],
        [Paragraph('Content-Based (TF-IDF)', table_cell_bold), Paragraph('0.700', table_cell), Paragraph('1.000', table_cell), Paragraph('0.824', table_cell), Paragraph('0.981', table_cell), Paragraph('100.0%', table_cell)],
        [Paragraph('Collaborative Filtering', table_cell_bold), Paragraph('0.450', table_cell), Paragraph('0.646', table_cell), Paragraph('0.530', table_cell), Paragraph('0.596', table_cell), Paragraph('83.3%', table_cell)],
        [Paragraph('<b>Hybrid Engine (α=0.6, β=0.4)</b>', table_cell_bold), Paragraph('<b>0.600</b>', table_cell_bold), Paragraph('<b>0.875</b>', table_cell_bold), Paragraph('<b>0.712</b>', table_cell_bold), Paragraph('<b>0.873</b>', table_cell_bold), Paragraph('<b>100.0%</b>', table_cell_bold)]
    ]
    t_bench = Table(bench_data, colWidths=[180, 100, 100, 100, 100, 120])
    t_bench.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_bench)
    story.append(Spacer(1, 14))
    story.append(Paragraph("● <b>Key Takeaway:</b> The Hybrid engine achieves an exceptional balance of high ranking quality (0.873 NDCG@5), high recall (87.5%), and complete catalog coverage (100%).", slide_bullet))

    story.append(PageBreak())

    # ==========================================
    # SLIDE 13: THANK YOU
    # ==========================================
    story.append(Spacer(1, 100))
    story.append(Paragraph('<font size="32" color="#0284c7"><b>Thank You</b></font>', ParagraphStyle('TYMain', alignment=1, leading=38)))
    story.append(Spacer(1, 16))
    story.append(Paragraph('<font size="14" color="#64748b">Questions &amp; Discussion</font>', ParagraphStyle('TYSub', alignment=1, leading=18)))
    story.append(Spacer(1, 24))
    story.append(Paragraph('<font size="11" color="#0369a1"><b>DineWise AI — Live Demo: https://dinewise-ai.vercel.app</b></font>', ParagraphStyle('TYLink', alignment=1, leading=14)))

    # Build presentation document
    doc.build(story, canvasmaker=SlideNumberedCanvas)
    print(f"Presentation PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    out_file = r"c:\Users\user\OneDrive\Desktop\client projects\Nadeem\major project\documentation_package\DineWise_AI_Final_Presentation_Slides.pdf"
    create_presentation_pdf(out_file)
