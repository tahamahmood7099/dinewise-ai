import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

class FullReportNumberedCanvas(canvas.Canvas):
    """Canvas with full academic header/footer formatting and dynamic total page counts."""
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
            self.draw_report_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_report_decorations(self, total_pages):
        if self._pageNumber > 1:
            self.saveState()
            self.setFont("Helvetica", 9)
            self.setFillColor(colors.HexColor("#64748b"))
            
            # Running header
            self.drawString(54, 11 * inch - 36, "DineWise AI — Major Project Documentation Report")
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "Osmania University / NSAKCET")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)
            
            # Running footer
            self.line(54, 48, 8.5 * inch - 54, 48)
            self.drawString(54, 34, "Department of Computer Science and Engineering")
            self.drawRightString(8.5 * inch - 54, 34, f"Page {self._pageNumber} of {total_pages}")
            self.restoreState()

def create_full_report_pdf(output_path):
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

    body = ParagraphStyle(
        'RepBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        firstLineIndent=28,
        spaceAfter=10,
        textColor=colors.HexColor('#0f172a')
    )

    body_no_indent = ParagraphStyle(
        'RepBodyNoIndent',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        firstLineIndent=0,
        spaceAfter=8,
        textColor=colors.HexColor('#0f172a')
    )

    heading = ParagraphStyle(
        'RepHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=20,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor('#0284c7'),
        keepWithNext=True
    )

    subheading = ParagraphStyle(
        'RepSubheading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=18,
        spaceBefore=10,
        spaceAfter=6,
        textColor=colors.HexColor('#0369a1'),
        keepWithNext=True
    )

    bullet = ParagraphStyle(
        'RepBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=17,
        leftIndent=20,
        firstLineIndent=-10,
        spaceAfter=6,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell = ParagraphStyle(
        'RepTableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0f172a')
    )

    table_cell_bold = ParagraphStyle(
        'RepTableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0f172a')
    )

    table_header = ParagraphStyle(
        'RepTableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.white
    )

    ref_style = ParagraphStyle(
        'RepRef',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        leftIndent=24,
        firstLineIndent=-24,
        spaceAfter=7,
        textColor=colors.HexColor('#1e293b')
    )

    story = []

    # ==========================================
    # COVER PAGE
    # ==========================================
    cover_center = ParagraphStyle('RepCoverCenter', parent=styles['Normal'], alignment=1, textColor=colors.HexColor('#0f172a'))
    story.append(Spacer(1, 30))
    story.append(Paragraph('<font size="12" color="#64748b"><b>A MAJOR PROJECT REPORT ON</b></font>', cover_center))
    story.append(Spacer(1, 16))
    story.append(Paragraph('<font size="18" color="#0284c7"><b>“DineWise AI: AI-Based Restaurant Recommendation &amp; Customer Behavior Analysis System”</b></font>', cover_center))
    story.append(Spacer(1, 24))
    
    story.append(Paragraph('<font size="11">Submitted in partial fulfillment of the requirements for the award of degree of</font>', cover_center))
    story.append(Spacer(1, 6))
    story.append(Paragraph('<font size="13"><b>BACHELOR OF ENGINEERING</b></font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="11">IN</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="13"><b>COMPUTER SCIENCE AND ENGINEERING</b></font>', cover_center))
    story.append(Spacer(1, 24))

    story.append(Paragraph('<font size="12"><b>SUBMITTED BY</b></font>', cover_center))
    story.append(Spacer(1, 8))

    auth_data = [
        [Paragraph('<b>NADEEM</b>', table_cell_bold), Paragraph('<b>[ROLL NUMBER]</b>', table_cell)],
        [Paragraph('<b>KAMRAN</b>', table_cell_bold), Paragraph('<b>[ROLL NUMBER]</b>', table_cell)],
        [Paragraph('<b>ABDUL BARI</b>', table_cell_bold), Paragraph('<b>[ROLL NUMBER]</b>', table_cell)]
    ]
    t_auth = Table(auth_data, colWidths=[200, 180])
    t_auth.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_auth)
    story.append(Spacer(1, 24))

    story.append(Paragraph('<font size="11">Under the esteemed guidance of</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="12"><b>[GUIDE NAME]</b></font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11">Professor of CSE, Dean</font>', cover_center))
    story.append(Spacer(1, 24))

    story.append(Paragraph('<font size="12"><b>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</b></font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="12"><b>NAWAB SHAH ALAM KHAN COLLEGE OF ENGINEERING &amp; TECHNOLOGY</b></font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11"><b>(AUTONOMOUS)</b></font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11">Affiliated to Osmania University, Hyderabad</font>', cover_center))
    story.append(Spacer(1, 2))
    story.append(Paragraph('<font size="11">Malakpet, Hyderabad — 500024</font>', cover_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph('<font size="11"><b>Academic Year 2026-2027</b></font>', cover_center))

    story.append(PageBreak())

    # ==========================================
    # CHAPTER 1: ABSTRACT & INTRODUCTION
    # ==========================================
    story.append(Paragraph('<u><b>Abstract</b></u>', heading))
    story.append(Paragraph(
        "This project presents DineWise AI, an intelligent restaurant recommendation and customer behavior analysis system engineered to resolve dining discovery challenges and cognitive choice overload in urban food landscapes. Traditional restaurant discovery platforms rely primarily on static popularity rankings, distance proximity, and generic filtering, failing to capture evolving user taste profiles, dietary constraints, and behavioral preferences. To address these limitations, DineWise AI introduces a hybrid machine learning recommendation architecture combining Content-Based Filtering via Term Frequency-Inverse Document Frequency (TF-IDF) cosine similarity with Collaborative Filtering powered by an implicit user-restaurant interaction matrix. The system incorporates real-time behavioral telemetry, natural language processing (NLP) for unstructured constraint parsing, and an Explainable AI (XAI) transparent scoring module that articulates recommendation rationale to users. Built on a modern decoupled architecture featuring a Next.js frontend and a high-performance Python FastAPI backend, the platform dynamically clusters users into distinct behavioral dining segments. Experimental offline model evaluations demonstrate that the proposed hybrid formulation (alpha = 0.6, beta = 0.4) achieves a Precision@5 of 0.600, Recall@5 of 0.875, and NDCG@5 of 0.873, substantially outperforming traditional popularity baselines while providing scalable, transparent, and personalized restaurant discovery.",
        body
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph('<u><b>Keywords</b></u>', heading))
    story.append(Paragraph("Recommender Systems, Restaurant Recommendation, Hybrid Filtering, Content-Based Filtering, Collaborative Filtering, Customer Behavior Intelligence, Explainable Artificial Intelligence (XAI), Natural Language Processing (NLP), FastAPI Architecture.", body))
    story.append(Spacer(1, 10))

    story.append(Paragraph('<u><b>1. Introduction &amp; Project Overview</b></u>', heading))
    story.append(Paragraph(
        "The urban dining sector across major Indian metropolitan areas—most notably Hyderabad—has witnessed exponential expansion in culinary diversity. With thousands of dining venues catering to distinct regional traditions, budget brackets, dietary requirements, and ambiance styles, consumers increasingly experience decision paralysis. DineWise AI is an engineering solution that replaces static, unpersonalized listing catalogs with an adaptive machine-learning recommendation engine that models individual user palates and explains why each recommendation is made.",
        body
    ))

    # ==========================================
    # CHAPTER 2: REQUIREMENTS SPECIFICATION
    # ==========================================
    story.append(Paragraph('<u><b>2. System Requirements Specification</b></u>', heading))
    story.append(Paragraph('<u><b>2.1 Functional Requirements</b></u>', subheading))
    story.append(Paragraph("• <b>FR-1 Personalized Recommendation Feed:</b> System shall generate ranked top-N recommendation feeds using a hybrid formula (0.6 Content + 0.4 Collaborative).", bullet))
    story.append(Paragraph("• <b>FR-2 Natural Language Query Parser:</b> System shall extract cuisine, zone, budget ceiling, and veg-only constraints from freeform user queries with typo tolerance.", bullet))
    story.append(Paragraph("• <b>FR-3 Explainable AI (XAI) Breakdown:</b> System shall calculate and display transparent factor score breakdowns (Cuisine, Zone, Price, Dietary match).", bullet))
    story.append(Paragraph("• <b>FR-4 Behavioral Telemetry Logging:</b> System shall record implicit client events (views, favorites, search queries, ratings, feedback) in real time.", bullet))
    story.append(Paragraph("• <b>FR-5 Admin Business Intelligence Portal:</b> System shall cluster users into dining personas and display live offline model evaluation metrics.", bullet))

    story.append(Paragraph('<u><b>2.2 Non-Functional Requirements</b></u>', subheading))
    story.append(Paragraph("• <b>NFR-1 Performance &amp; Latency:</b> API recommendation response latency shall not exceed 50ms under typical request loads.", bullet))
    story.append(Paragraph("• <b>NFR-2 Scalability:</b> Database and recommendation services shall scale gracefully with growing restaurant catalogs and user interaction logs.", bullet))
    story.append(Paragraph("• <b>NFR-3 Reliability:</b> System shall provide graceful fallback mechanisms (e.g. popularity baseline) when cold-start users lack interaction history.", bullet))
    story.append(Paragraph("• <b>NFR-4 Usability:</b> Frontend shall be fully responsive across mobile and desktop viewports with accessible dark/light theme support.", bullet))

    story.append(Paragraph('<u><b>2.3 Software &amp; Hardware Requirements</b></u>', subheading))
    story.append(Paragraph("• <b>Software:</b> Python 3.11+, FastAPI 0.110+, Next.js 14, React 18, Tailwind CSS, scikit-learn 1.4+, SQLite/PostgreSQL, Git, Vercel, Render.", bullet))
    story.append(Paragraph("• <b>Hardware:</b> Modern Intel/AMD multi-core processor (2.0 GHz+), 8 GB RAM (16 GB recommended), 256 GB SSD storage, broadband internet.", bullet))

    # ==========================================
    # CHAPTER 3: SYSTEM ARCHITECTURE & MODULES
    # ==========================================
    story.append(Paragraph('<u><b>3. System Architecture &amp; Module Design</b></u>', heading))
    story.append(Paragraph(
        "DineWise AI employs a decoupled three-tier architecture separating the client presentation layer from asynchronous backend microservices and relational data stores. The system components comprise:",
        body
    ))
    story.append(Paragraph("1. <b>Presentation Tier (Next.js 14):</b> Renders responsive discovery views, filter bars, search interfaces, and XAI explanation modals.", bullet))
    story.append(Paragraph("2. <b>NLP Query Processor:</b> Tokenizes user search queries and extracts semantic dining entities using regex-based slot matching.", bullet))
    story.append(Paragraph("3. <b>Content-Based TF-IDF Engine:</b> Transforms restaurant culinary attributes into high-dimensional TF-IDF vectors and computes cosine similarity.", bullet))
    story.append(Paragraph("4. <b>Collaborative Interaction Engine:</b> Evaluates user-user interaction overlap across implicit telemetry weights to find peer neighborhoods.", bullet))
    story.append(Paragraph("5. <b>Hybrid Fusion Ranker:</b> Computes weighted linear combinations to produce final sorted recommendation feeds.", bullet))
    story.append(Paragraph("6. <b>Telemetry &amp; Feedback Subsystem:</b> Records user interactions and updates user preference vectors dynamically.", bullet))
    story.append(Paragraph("7. <b>Admin Intelligence Portal:</b> Groups users into behavioral clusters and computes offline ranking metrics.", bullet))

    # ==========================================
    # CHAPTER 4: DATABASE DESIGN
    # ==========================================
    story.append(Paragraph('<u><b>4. Database Design &amp; Schema</b></u>', heading))
    story.append(Paragraph(
        "The relational database schema is structured into normalized entities with indexed foreign key relationships ensuring data integrity and rapid query execution.",
        body
    ))

    db_schema_data = [
        [Paragraph('<b>Entity / Table</b>', table_header), Paragraph('<b>Primary Key</b>', table_header), Paragraph('<b>Foreign Keys</b>', table_header), Paragraph('<b>Key Attributes &amp; Schema Role</b>', table_header)],
        [Paragraph('Restaurants', table_cell_bold), Paragraph('restaurant_id', table_cell), Paragraph('category_id', table_cell), Paragraph('name, cuisine, area, price_for_two, rating, veg_only, specialty_dishes, tags', table_cell)],
        [Paragraph('CuisineCategories', table_cell_bold), Paragraph('category_id', table_cell), Paragraph('None', table_cell), Paragraph('name, icon, description, restaurant_count', table_cell)],
        [Paragraph('Users', table_cell_bold), Paragraph('user_id', table_cell), Paragraph('None', table_cell), Paragraph('email, full_name, preferred_cuisines, budget_preference, dietary_type', table_cell)],
        [Paragraph('Interactions', table_cell_bold), Paragraph('interaction_id', table_cell), Paragraph('user_id, restaurant_id', table_cell), Paragraph('interaction_type (view, favorite, rating), weight, timestamp', table_cell)],
        [Paragraph('Favorites', table_cell_bold), Paragraph('favorite_id', table_cell), Paragraph('user_id, restaurant_id', table_cell), Paragraph('created_at, active_status', table_cell)],
        [Paragraph('Ratings', table_cell_bold), Paragraph('rating_id', table_cell), Paragraph('user_id, restaurant_id', table_cell), Paragraph('score (1.0–5.0), review_text, created_at', table_cell)]
    ]
    t_dbs = Table(db_schema_data, colWidths=[90, 80, 100, 210])
    t_dbs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_dbs)
    story.append(Spacer(1, 10))

    # ==========================================
    # CHAPTER 5: UML DIAGRAM DESCRIPTIONS
    # ==========================================
    story.append(Paragraph('<u><b>5. UML Diagram Specifications</b></u>', heading))
    story.append(Paragraph('<u><b>5.1 Use Case Diagram Description</b></u>', subheading))
    story.append(Paragraph("• <b>Actors:</b> User (Consumer), Restaurant Admin, System Background Evaluator.", bullet))
    story.append(Paragraph("• <b>Primary Use Cases:</b> Browse Restaurants, Search with Natural Language, View Recommendation Feed, Inspect Explainable AI Modal, Toggle Favorite, Rate Venue, Submit Feedback, View Customer Segmentation Analytics.", bullet))
    
    story.append(Paragraph('<u><b>5.2 Activity Diagram Description</b></u>', subheading))
    story.append(Paragraph("• Models the decision flow: User launches app → Extract preference vector → Check telemetry history → If cold start, query Content Engine; If history exists, query Content + Collaborative Engines → Fuse scores with weights (0.6, 0.4) → Apply filters → Render recommendation feed → Await user interaction → Log telemetry asynchronously.", bullet))

    story.append(Paragraph('<u><b>5.3 Class Diagram Description</b></u>', subheading))
    story.append(Paragraph("• Core domain classes: Restaurant, CuisineCategory, UserProfile, InteractionLog, RecommendationEngine (with ContentFilter and CollaborativeFilter sub-services), ExplainabilityService, and EvaluationService.", bullet))

    story.append(Paragraph('<u><b>5.4 Sequence Diagram Description</b></u>', subheading))
    story.append(Paragraph("• Traces asynchronous message exchanges: Client UI sends GET /api/recommendations/feed → FastAPI Gateway authenticates session → Orchestrator queries Database for user profile and telemetry → Passes data to HybridEngine → Computes TF-IDF and collaborative dot-products → Fuses rankings → Returns JSON payload → Client UI renders feed with toast feedback.", bullet))

    # ==========================================
    # CHAPTER 6: EXPERIMENTAL RESULTS
    # ==========================================
    story.append(Paragraph('<u><b>6. Experimental Evaluation &amp; Benchmarks</b></u>', heading))
    story.append(Paragraph(
        "To rigorously quantify recommendation accuracy, offline validation was performed on held-out interaction sets across standard top-5 information retrieval metrics.",
        body
    ))

    bench_data = [
        [Paragraph('<b>Model</b>', table_header), Paragraph('<b>Precision@5</b>', table_header), Paragraph('<b>Recall@5</b>', table_header), Paragraph('<b>F1-Score</b>', table_header), Paragraph('<b>NDCG@5</b>', table_header), Paragraph('<b>Coverage</b>', table_header)],
        [Paragraph('Popularity Baseline', table_cell_bold), Paragraph('0.400', table_cell), Paragraph('0.583', table_cell), Paragraph('0.475', table_cell), Paragraph('0.534', table_cell), Paragraph('100.0%', table_cell)],
        [Paragraph('Content-Based (TF-IDF)', table_cell_bold), Paragraph('0.700', table_cell), Paragraph('1.000', table_cell), Paragraph('0.824', table_cell), Paragraph('0.981', table_cell), Paragraph('100.0%', table_cell)],
        [Paragraph('Collaborative Filtering', table_cell_bold), Paragraph('0.450', table_cell), Paragraph('0.646', table_cell), Paragraph('0.530', table_cell), Paragraph('0.596', table_cell), Paragraph('83.3%', table_cell)],
        [Paragraph('<b>Hybrid Engine (α=0.6, β=0.4)</b>', table_cell_bold), Paragraph('<b>0.600</b>', table_cell_bold), Paragraph('<b>0.875</b>', table_cell_bold), Paragraph('<b>0.712</b>', table_cell_bold), Paragraph('<b>0.873</b>', table_cell_bold), Paragraph('<b>100.0%</b>', table_cell_bold)]
    ]
    t_bench = Table(bench_data, colWidths=[140, 65, 65, 65, 65, 75])
    t_bench.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0369a1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t_bench)
    story.append(Spacer(1, 10))

    # ==========================================
    # CHAPTER 7: CONCLUSION & REFERENCES
    # ==========================================
    story.append(Paragraph('<u><b>7. Conclusion &amp; References</b></u>', heading))
    story.append(Paragraph(
        "DineWise AI successfully demonstrates an end-to-end, mathematically grounded, and explainable restaurant recommendation and customer behavior intelligence system. By fusing content metadata with collaborative community interactions, the system eliminates cold-start bottlenecks, achieves 0.873 NDCG@5 ranking quality, and delivers a modern, high-speed user experience deployed permanently on Vercel and Render.",
        body
    ))

    # Build the document
    doc.build(story, canvasmaker=FullReportNumberedCanvas)
    print(f"Full Project Report PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    out_file = r"c:\Users\user\OneDrive\Desktop\client projects\Nadeem\major project\documentation_package\DineWise_AI_Complete_Major_Project_Report.pdf"
    create_full_report_pdf(out_file)
