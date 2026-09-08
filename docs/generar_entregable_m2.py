"""Genera el Entregable Módulo 2 #NoLimits de GeoTurismoSV (A4 horizontal)."""

from pathlib import Path

from fpdf import FPDF

OUT = Path(r"C:\Users\jhoan\Downloads\GeoTurismoSV_Entregable_Modulo_2_NoLimits.pdf")
FONT = r"C:\Windows\Fonts\segoeui.ttf"
FONT_B = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_I = r"C:\Windows\Fonts\segoeuii.ttf"

NAVY = (11, 37, 64)
BLUE = (11, 111, 179)
GREEN = (22, 138, 26)
ORANGE = (244, 160, 0)
DARK = (26, 35, 50)
MUTED = (90, 102, 118)
WHITE = (255, 255, 255)
BG = (244, 247, 250)
LINE = (220, 228, 236)
NOW_C = (14, 116, 144)
WOW_C = (22, 138, 26)
HOW_C = (180, 83, 9)


class PDF(FPDF):
    def __init__(self):
        super().__init__(orientation="L", unit="mm", format="A4")
        self.set_auto_page_break(False)
        self.add_font("ui", "", FONT)
        self.add_font("ui", "B", FONT_B)
        self.add_font("ui", "I", FONT_I)

    def footer_bar(self):
        self.set_fill_color(*NAVY)
        self.rect(0, 200, 297, 10, "F")
        self.set_font("ui", "", 8)
        self.set_text_color(*WHITE)
        self.set_xy(12, 202.5)
        self.cell(180, 5, "#NoLimits  |  GeoTurismoSV  |  D8 Turismo Sostenible  |  Módulo 2", align="L")
        self.set_xy(250, 202.5)
        self.cell(35, 5, str(self.page_no()), align="R")

    def page_header(self, num, title):
        self.set_fill_color(*NAVY)
        self.rect(0, 0, 297, 16, "F")
        self.set_fill_color(*ORANGE)
        self.rect(0, 16, 297, 1.2, "F")
        self.set_font("ui", "B", 9)
        self.set_text_color(*ORANGE)
        self.set_xy(12, 4)
        self.cell(20, 8, f"{num:02d}")
        self.set_text_color(*WHITE)
        self.set_font("ui", "B", 13)
        self.set_xy(28, 4)
        self.cell(200, 8, title)
        self.set_font("ui", "", 8)
        self.set_text_color(180, 200, 220)
        self.set_xy(210, 4)
        self.cell(75, 8, "D8  ·  GeoTurismoSV  ·  #NoLimits", align="R")


def cover(pdf: PDF):
    pdf.add_page()
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 297, 210, "F")
    pdf.set_fill_color(*BLUE)
    pdf.rect(0, 0, 8, 210, "F")
    pdf.set_fill_color(*GREEN)
    pdf.rect(8, 0, 3, 210, "F")
    pdf.set_fill_color(*ORANGE)
    pdf.rect(0, 198, 297, 4, "F")

    pdf.set_font("ui", "", 11)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(28, 22)
    pdf.cell(0, 8, "ENTREGABLE  ·  D8 RETO 4")

    pdf.set_font("ui", "B", 34)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(28, 32)
    pdf.cell(0, 15, "MÓDULO 2")

    pdf.set_font("ui", "", 13)
    pdf.set_text_color(180, 210, 230)
    pdf.set_xy(28, 50)
    pdf.cell(0, 7, "Ideación, evaluación y selección de solución")

    pdf.set_fill_color(*BLUE)
    pdf.rect(28, 64, 40, 1.5, "F")

    pdf.set_font("ui", "B", 26)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(28, 72)
    pdf.cell(0, 11, "GeoTurismoSV")

    pdf.set_font("ui", "B", 12)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(28, 86)
    pdf.cell(0, 7, "Turismo Sostenible")

    pdf.set_font("ui", "I", 12)
    pdf.set_text_color(200, 220, 235)
    pdf.set_xy(28, 96)
    pdf.cell(0, 7, "Visitantes conectados con comunidades, emprendimientos y patrimonio")

    stats = [
        ("12", "ideas generadas"),
        ("3", "ideas finalistas"),
        ("1", "idea seleccionada"),
    ]
    x = 28
    for n, label in stats:
        pdf.set_fill_color(18, 55, 90)
        pdf.rect(x, 118, 72, 28, "F")
        pdf.set_font("ui", "B", 22)
        pdf.set_text_color(*ORANGE)
        pdf.set_xy(x + 6, 125)
        pdf.cell(60, 10, n)
        pdf.set_font("ui", "", 10)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x + 6, 136)
        pdf.cell(60, 8, label)
        x += 80

    pdf.set_font("ui", "B", 9)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(28, 154)
    pdf.cell(0, 5, "Equipo")
    pdf.set_font("ui", "", 9)
    pdf.set_text_color(160, 185, 205)
    pdf.set_xy(28, 160)
    pdf.multi_cell(
        250,
        5,
        "Jhoan Mauricio Ortega Ventura  ·  Alejandra María Baires Campos  ·  "
        "Francisca Del Carmen Bonilla Argueta  ·  Roberto Antonio López Ramírez",
    )
    pdf.set_xy(28, 170)
    pdf.multi_cell(
        250,
        5,
        "Flor Guadalupe Villatoro Vásquez  ·  Lilian Amaraly Perla Arias  ·  "
        "Katia Marilin Santos Avelar  ·  Gerardo Eliseo Guevara Reyes",
    )
    pdf.set_xy(28, 184)
    pdf.set_font("ui", "B", 11)
    pdf.set_text_color(*WHITE)
    pdf.cell(0, 6, "#NoLimits  ·  GeoTurismoSV  ·  Módulo II  ·  D8 Turismo Sostenible")


def page_objetivo(pdf: PDF):
    pdf.add_page()
    pdf.page_header(1, "Objetivo y reto del módulo")
    pdf.footer_bar()

    pdf.set_font("ui", "", 11)
    pdf.set_text_color(*DARK)
    pdf.set_xy(14, 22)
    pdf.multi_cell(
        269,
        5.5,
        "Objetivo: generar ideas realizables y escalables, pero innovadoras, usando lluvia de ideas / COCD Box, "
        "Cono del Futuro y debate con IA.",
    )

    pdf.set_fill_color(*BLUE)
    pdf.rect(14, 36, 269, 52, "F")
    pdf.set_font("ui", "B", 9)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(20, 39)
    pdf.cell(0, 6, "D8  RETO 4  ·  TURISMO SOSTENIBLE")
    pdf.set_font("ui", "B", 11.5)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(20, 47)
    pdf.multi_cell(
        257,
        5.8,
        "¿Cómo podemos conectar mejor a visitantes con comunidades, emprendimientos y experiencias locales "
        "para que el crecimiento del turismo genere más oportunidades económicas y contribuya a conservar "
        "el patrimonio natural y cultural de los destinos?",
    )

    pdf.set_font("ui", "", 10)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 94)
    pdf.multi_cell(
        269,
        5.3,
        "El propósito es evolucionar GeoTurismoSV de un catálogo de destinos a un puente: el visitante encuentra "
        "experiencias locales; el emprendedor y la comunidad anfitriona ganan visibilidad e ingreso; el patrimonio "
        "natural y cultural se cuida al orientar la visita (menos saturación, más respeto, más valor local).",
    )

    steps = [
        ("1. Idear", "Generar muchas\nposibilidades"),
        ("2. Clasificar", "COCD Box: NOW / HOW /\nWOW"),
        ("3. Evaluar", "Innovación, factibilidad y\nmás"),
        ("4. Elegir", "Seleccionar la mejor\napuesta"),
    ]
    x = 14
    colors = [BLUE, GREEN, ORANGE, NAVY]
    for i, (t, d) in enumerate(steps):
        pdf.set_fill_color(*colors[i])
        pdf.rect(x, 122, 64, 38, "F")
        pdf.set_font("ui", "B", 12)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x + 4, 125)
        pdf.cell(56, 7, t)
        pdf.set_font("ui", "", 9)
        pdf.set_xy(x + 4, 134)
        pdf.multi_cell(56, 5, d)
        x += 68

    pdf.set_font("ui", "I", 9)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 168)
    pdf.multi_cell(
        269,
        5,
        "Principio de ideación aplicado: primero buscamos cantidad, después evaluamos calidad y factibilidad. "
        "Durante la lluvia de ideas no descartamos propuestas prematuramente. Partimos de lo que GeoTurismoSV "
        "ya resuelve (mapa, clima, destinos, favoritos y administración) para imaginar cómo conectar visitante, "
        "comunidad, emprendimiento y patrimonio.",
    )


def page_lluvia(pdf: PDF):
    pdf.add_page()
    pdf.page_header(2, "Lluvia de ideas - Brainwriting")
    pdf.footer_bar()

    pdf.set_font("ui", "", 10)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 22)
    pdf.multi_cell(
        269,
        5,
        "Ideas generadas para responder al D8 · Turismo Sostenible. La intención es ampliar posibilidades antes de seleccionar.",
    )

    ideas = [
        ("1", "Directorio de emprendimientos", "Mostrar guías, hostales, artesanos y gastronomía junto a cada destino."),
        ("2", "Experiencias comunitarias", "Visibilizar cooperativas, pueblos y turismo rural de la comunidad anfitriona."),
        ("3", "Sello de turismo sostenible", "Filtrar lugares de bajo impacto que cuidan naturaleza y cultura."),
        ("4", "Mapa destino + negocio local", "Ver en el mapa qué emprendimientos hay cerca del atractivo."),
        ("5", "Visita responsable", "Sugerir horarios, aforo y buenas prácticas para no dañar el sitio."),
        ("6", "Panel emprendedor", "Dueños publican y actualizan su experiencia, horario, costo y contacto."),
        ("7", "Rutas que descongestionan", "Recomendar destinos menos saturados para repartir el beneficio económico."),
        ("8", "Comunidad guardiana", "Viajeros y locales reportan saturación, daño o acceso al patrimonio."),
        ("9", "Asistente IA local", "Recomendar experiencias de MIPYMES según presupuesto, tiempo e interés."),
        ("10", "Historias de patrimonio", "Contar quién vive el lugar: cultura, naturaleza y comunidad anfitriona."),
        ("11", "Realidad aumentada cultural", "Guías visuales en sitios arqueológicos, volcanes y centros históricos."),
        ("12", "Pago directo al emprendedor", "Reservar y pagar tours o hospedaje sin intermediarios costosos."),
    ]

    w, h = 88, 22
    start_x, start_y = 14, 34
    for i, (n, t, d) in enumerate(ideas):
        col, row = i % 3, i // 3
        x = start_x + col * 91
        y = start_y + row * 24.5
        pdf.set_fill_color(*BG)
        pdf.rect(x, y, w, h, "F")
        pdf.set_fill_color(*BLUE)
        pdf.rect(x, y, 8, h, "F")
        pdf.set_font("ui", "B", 9)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x, y + 7)
        pdf.cell(8, 6, n, align="C")
        pdf.set_font("ui", "B", 9)
        pdf.set_text_color(*NAVY)
        pdf.set_xy(x + 11, y + 2)
        pdf.cell(74, 6, t)
        pdf.set_font("ui", "", 8)
        pdf.set_text_color(*MUTED)
        pdf.set_xy(x + 11, y + 8)
        pdf.multi_cell(74, 4, d)

    pdf.set_font("ui", "I", 9)
    pdf.set_text_color(*DARK)
    pdf.set_xy(14, 136)
    pdf.multi_cell(
        269,
        5,
        "Resultado: 12 posibilidades que cubren conexión económica (emprendedor, mapa local, pago directo), "
        "conservación (sello sostenible, visita responsable, comunidad guardiana) y el producto actual "
        "(destinos, mapa, clima) como base para no partir de cero.",
    )


def page_cocd(pdf: PDF):
    pdf.add_page()
    pdf.page_header(3, "Clasificación COCD Box")
    pdf.footer_bar()

    pdf.set_font("ui", "", 10)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 22)
    pdf.multi_cell(
        269,
        5,
        "Organizamos las ideas por nivel de originalidad y dificultad de implementación. Así distinguimos "
        "soluciones de ejecución inmediata, ideas ambiciosas y oportunidades con balance atractivo.",
    )

    boxes = [
        (NOW_C, "NOW", "Factibles y comunes", [
            "Catálogo de destinos",
            "Mapa interactivo",
            "Clima por destino",
            "Filtros básicos",
            "Favoritos y perfil",
            "Administración central",
        ]),
        (WOW_C, "WOW", "Originales y factibles", [
            "GeoTurismo Emprendedor",
            "GeoTurismo Inteligente",
            "GeoTurismo Comunidad",
        ]),
        (HOW_C, "HOW", "Originales y complejas", [
            "Pago directo al emprendedor",
            "Marketplace de experiencias",
            "Realidad aumentada cultural",
            "Sensores de aforo en sitios",
            "Sello oficial de sostenibilidad",
            "Itinerarios IA de varios días",
        ]),
    ]
    x = 14
    for color, tag, sub, items in boxes:
        pdf.set_fill_color(*color)
        pdf.rect(x, 40, 88, 12, "F")
        pdf.set_font("ui", "B", 11)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x + 3, 42)
        pdf.cell(82, 8, f"{tag}  —  {sub}")
        pdf.set_fill_color(*BG)
        pdf.rect(x, 52, 88, 108, "F")
        pdf.set_font("ui", "", 9)
        pdf.set_text_color(*DARK)
        yy = 58
        for item in items:
            pdf.set_fill_color(*color)
            pdf.rect(x + 5, yy + 1.5, 2.5, 2.5, "F")
            pdf.set_xy(x + 11, yy)
            pdf.cell(72, 6, f"•  {item}")
            yy += 8
        x += 91

    pdf.set_font("ui", "I", 9)
    pdf.set_text_color(*DARK)
    pdf.set_xy(14, 168)
    pdf.multi_cell(
        269,
        5,
        "Decisión: las tres ideas WOW pasan a evaluación porque responden al D8 (conectar visitante, economía "
        "local y patrimonio) y se pueden construir sobre el prototipo web, sin hardware ni alianzas masivas.",
    )


def page_finalistas(pdf: PDF):
    pdf.add_page()
    pdf.page_header(4, "Tres ideas finalistas")
    pdf.footer_bar()

    pdf.set_font("ui", "", 10)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 22)
    pdf.cell(0, 6, "Estas son las propuestas que pasan al debate y evaluación frente al D8 · Turismo Sostenible.")

    ideas = [
        (GREEN, "1  GeoTurismo Emprendedor",
         "Panel para guías, hostales, cooperativas, artesanos y gastronomía local. Publican experiencias junto "
         "al destino, con horario, costo y contacto, para que el visitante gaste en la comunidad y no solo “vea el lugar”.",
         "Ejemplo: “Junto a Suchitoto aparecen un hostal familiar, un taller de añil y un tour con guía local.”"),
        (BLUE, "2  GeoTurismo Inteligente",
         "Usa destinos, clima, mapa y filtros para recomendar experiencias locales y rutas menos saturadas. "
         "Orienta la visita para repartir beneficio económico y reducir presión sobre el patrimonio.",
         "Ejemplo: “Este volcán está saturado hoy. Se sugiere un pueblo cercano con mirador y gastronomía local.”"),
        (ORANGE, "3  GeoTurismo Comunidad",
         "Red donde visitantes y comunidades reportan saturación, daño ambiental, acceso cerrado o buenas prácticas. "
         "Los reportes protegen el patrimonio natural y cultural y avisan a otros viajeros.",
         "Ejemplo: “La comunidad reporta que el sendero está erosionado; se recomienda otra ruta esta semana.”"),
    ]
    y = 32
    for color, title, body, ex in ideas:
        pdf.set_fill_color(*color)
        pdf.rect(14, y, 4, 28, "F")
        pdf.set_fill_color(*BG)
        pdf.rect(18, y, 265, 28, "F")
        pdf.set_font("ui", "B", 11)
        pdf.set_text_color(*NAVY)
        pdf.set_xy(22, y + 1.5)
        pdf.cell(250, 6, title)
        pdf.set_font("ui", "", 8.5)
        pdf.set_text_color(*DARK)
        pdf.set_xy(22, y + 8)
        pdf.multi_cell(257, 4.2, body)
        pdf.set_font("ui", "I", 8)
        pdf.set_text_color(*MUTED)
        pdf.set_xy(22, y + 20.5)
        pdf.cell(257, 5, ex)
        y += 31

    pdf.set_font("ui", "B", 10)
    pdf.set_text_color(*NAVY)
    pdf.set_xy(14, y + 2)
    pdf.cell(0, 6, "Votación con colores")

    headers = ["Idea", "Motiva  ROJO", "Innovadora  VERDE", "Factible  AZUL"]
    col_w = [90, 58, 62, 55]
    y = y + 10
    pdf.set_fill_color(*NAVY)
    pdf.set_text_color(*WHITE)
    pdf.set_font("ui", "B", 8)
    x = 14
    for h, w in zip(headers, col_w):
        pdf.set_xy(x, y)
        pdf.cell(w, 7, h, fill=True, align="C")
        x += w
    rows = [
        ("GeoTurismo Emprendedor", "SI", "SI", "SI"),
        ("GeoTurismo Inteligente", "SI", "SI", ""),
        ("GeoTurismo Comunidad", "SI", "SI", ""),
    ]
    y += 7
    pdf.set_font("ui", "", 9)
    for i, row in enumerate(rows):
        fill = (236, 244, 250) if i % 2 == 0 else WHITE
        pdf.set_fill_color(*fill)
        pdf.set_text_color(*DARK)
        x = 14
        for j, (val, w) in enumerate(zip(row, col_w)):
            pdf.set_xy(x, y)
            align = "L" if j == 0 else "C"
            pdf.cell(w, 7, "  " + val if j == 0 else val, fill=True, align=align)
            x += w
        y += 7

    pdf.set_font("ui", "I", 9)
    pdf.set_text_color(*DARK)
    pdf.set_xy(14, y + 4)
    pdf.multi_cell(
        269,
        5,
        "Resultado preliminar: GeoTurismo Emprendedor logra el mejor balance. Es la idea que más directo responde "
        "al D8: conectar visitantes con comunidades y emprendimientos para que el turismo deje ingreso local.",
    )


def page_evaluacion(pdf: PDF):
    pdf.add_page()
    pdf.page_header(5, "Evaluación de impacto con IA")
    pdf.footer_bar()

    pdf.set_font("ui", "", 10)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 22)
    pdf.multi_cell(
        269,
        5,
        "Cada idea se puntúa de 1 a 5 en innovación, factibilidad, deseabilidad, impacto sistémico y escalabilidad, "
        "preguntándonos cuál conecta mejor visitante, economía local y conservación.",
    )

    headers = ["Criterio", "GeoTurismo Emprendedor", "GeoTurismo Inteligente", "GeoTurismo Comunidad"]
    col_w = [62, 69, 69, 69]
    rows = [
        ("Innovación", "5/5", "4/5", "4/5"),
        ("Factibilidad", "4/5", "5/5", "3/5"),
        ("Deseabilidad", "5/5", "4/5", "4/5"),
        ("Impacto sistémico", "5/5", "4/5", "5/5"),
        ("Escalabilidad", "4/5", "5/5", "5/5"),
        ("TOTAL", "23/25", "22/25", "21/25"),
    ]
    y = 38
    pdf.set_fill_color(*NAVY)
    pdf.set_text_color(*WHITE)
    pdf.set_font("ui", "B", 8)
    x = 14
    for h, w in zip(headers, col_w):
        pdf.set_xy(x, y)
        pdf.cell(w, 8, h, fill=True, align="C")
        x += w
    y += 8
    for i, row in enumerate(rows):
        last = i == len(rows) - 1
        pdf.set_font("ui", "B" if last else "", 9)
        fill = (22, 138, 26) if last else ((236, 244, 250) if i % 2 == 0 else WHITE)
        pdf.set_fill_color(*fill)
        pdf.set_text_color(*WHITE if last else DARK)
        x = 14
        for j, (val, w) in enumerate(zip(row, col_w)):
            pdf.set_xy(x, y)
            align = "L" if j == 0 else "C"
            txt = ("  " + val) if j == 0 else val
            pdf.cell(w, 8, txt, fill=True, align=align)
            x += w
        y += 8

    pdf.set_font("ui", "B", 10)
    pdf.set_text_color(*NAVY)
    pdf.set_xy(14, y + 6)
    pdf.cell(0, 6, "Ranking:  1) Emprendedor — 23/25.   2) Inteligente — 22/25.   3) Comunidad — 21/25.")

    y += 16
    pdf.set_fill_color(*NAVY)
    pdf.set_text_color(*WHITE)
    pdf.set_font("ui", "B", 8)
    heads2 = ["Idea", "Principal fortaleza", "Principal debilidad"]
    w2 = [62, 103.5, 103.5]
    x = 14
    for h, w in zip(heads2, w2):
        pdf.set_xy(x, y)
        pdf.cell(w, 7, "  " + h, fill=True)
        x += w
    y += 7
    swot = [
        ("GeoTurismo Emprendedor",
         "Conecta visitantes con oferta local y genera ingreso en la comunidad.",
         "Requiere moderación, verificación y más roles de usuario."),
        ("GeoTurismo Inteligente",
         "Alta factibilidad: usa el prototipo para orientar visitas más responsables.",
         "Sin emprendedores visibles, sigue siendo un catálogo de destinos."),
        ("GeoTurismo Comunidad",
         "Protege patrimonio con conocimiento colectivo y efecto de red.",
         "Necesita masa crítica de locales y viajeros activos."),
    ]
    pdf.set_font("ui", "", 8)
    pdf.set_text_color(*DARK)
    for i, row in enumerate(swot):
        fill = (236, 244, 250) if i % 2 == 0 else WHITE
        pdf.set_fill_color(*fill)
        x = 14
        heights = 12
        for j, (val, w) in enumerate(zip(row, w2)):
            pdf.set_xy(x, y)
            pdf.cell(w, heights, "", fill=True)
            pdf.set_xy(x + 2, y + 1.5)
            pdf.multi_cell(w - 4, 4.5, val)
            x += w
        y += heights


def page_justificacion(pdf: PDF):
    pdf.add_page()
    pdf.page_header(6, "Justificación crítica de las puntuaciones")
    pdf.footer_bar()

    blocks = [
        ("GeoTurismo Emprendedor", GREEN, [
            ("Innovación 5/5", "Pocos catálogos locales salvadoreños dan voz al emprendedor. Convierte el destino en un ecosistema de experiencias, no en una ficha turística."),
            ("Factibilidad 4/5", "Es software: nuevo rol, panel y reglas de acceso sobre el prototipo. Exige moderación y verificación para no publicar lugares falsos."),
            ("Deseabilidad 5/5", "El visitante busca qué hacer y dónde gastar; el emprendedor busca visibilidad. Ambos lados del D8 quieren esta conexión."),
            ("Impacto sistémico 5/5", "El crecimiento turístico puede dejar ingreso en MIPYMES y comunidades, no solo en el atractivo fotografiado."),
            ("Escalabilidad 4/5", "Escala como software, pero cada nuevo emprendedor implica confianza, soporte y curaduría."),
        ]),
        ("GeoTurismo Inteligente", BLUE, [
            ("Innovación 4/5", "Las recomendaciones existen en turismo digital; aquí se diferencian si priorizan experiencias locales y destinos menos saturados."),
            ("Factibilidad 5/5", "Casi todo el dato ya está en el prototipo (destinos, clima, mapa, filtros). Se puede empezar sin nuevo rol."),
            ("Deseabilidad 4/5", "Ayuda a decidir, pero si no muestra a la comunidad anfitriona el visitante sigue “pasando de largo”."),
            ("Impacto sistémico 4/5", "Puede descongestionar patrimonio, aunque el beneficio económico local queda indirecto."),
            ("Escalabilidad 5/5", "Llega a más viajeros por la web, sin hardware ni masa crítica de emprendedores."),
        ]),
        ("GeoTurismo Comunidad", ORANGE, [
            ("Innovación 4/5", "Une visitantes y comunidades para cuidar el patrimonio con alertas geográficas reales."),
            ("Factibilidad 3/5", "El software es viable, pero sin masa crítica los reportes quedan vacíos o sesgados."),
            ("Deseabilidad 4/5", "Útil para conservar, aunque depende de participación y confianza en los reportes."),
            ("Impacto sistémico 5/5", "Un aviso de erosión, saturación o acceso cerrado protege a muchos y al sitio mismo."),
            ("Escalabilidad 5/5", "La red puede crecer a más destinos con bajo costo marginal, si hay usuarios activos."),
        ]),
    ]
    x = 14
    for title, color, rows in blocks:
        pdf.set_fill_color(*color)
        pdf.rect(x, 22, 88, 10, "F")
        pdf.set_font("ui", "B", 10)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x + 2, 23.5)
        pdf.cell(84, 7, title, align="C")
        yy = 34
        for lab, txt in rows:
            pdf.set_font("ui", "B", 8)
            pdf.set_text_color(*color)
            pdf.set_xy(x, yy)
            pdf.cell(88, 5, lab)
            pdf.set_font("ui", "", 7.5)
            pdf.set_text_color(*DARK)
            pdf.set_xy(x, yy + 5)
            pdf.multi_cell(88, 3.6, txt)
            yy += 31
        x += 91


def page_cono(pdf: PDF):
    pdf.add_page()
    pdf.page_header(7, "Cono del Futuro - GeoTurismoSV")
    pdf.footer_bar()

    pdf.set_font("ui", "", 10)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 22)
    pdf.multi_cell(
        269,
        5,
        "Visualizamos tres escenarios para orientar la evolución del proyecto frente al turismo sostenible: poco posible, muy probable y WOW deseable.",
    )

    pdf.set_font("ui", "B", 9)
    pdf.set_text_color(*NAVY)
    pdf.set_xy(14, 36)
    pdf.cell(0, 6, "AHORA          →          1 año          →          2 años          →          3 años")

    cols = [
        (HOW_C, "POCO POSIBLE",
         "Un sistema que cobra, fiscaliza aforo con sensores, certifica sostenibilidad oficial y guía con realidad aumentada cada sitio del país, sin intervención humana. Es imaginable, pero hoy exige infraestructura, alianzas y recursos que no tenemos."),
        (NOW_C, "MUY PROBABLE",
         "Web donde el visitante explora destinos, mapa y clima, y el administrador mantiene el catálogo. Es el prototipo actual: visibilidad del lugar, todavía débil en conectar con la comunidad anfitriona."),
        (WOW_C, "WOW DESEABLE",
         "GeoTurismoSV es el puente: el visitante encuentra experiencias locales; el emprendedor publica su oferta; la comunidad cuida el patrimonio. El turismo crece y deja valor en el destino, no solo fotos."),
    ]
    x = 14
    for color, title, body in cols:
        pdf.set_fill_color(*color)
        pdf.rect(x, 46, 88, 10, "F")
        pdf.set_font("ui", "B", 10)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x, 47.5)
        pdf.cell(88, 7, title, align="C")
        pdf.set_fill_color(*BG)
        pdf.rect(x, 56, 88, 64, "F")
        pdf.set_font("ui", "", 8.2)
        pdf.set_text_color(*DARK)
        pdf.set_xy(x + 4, 59)
        pdf.multi_cell(80, 4.4, body)
        x += 91

    pdf.set_fill_color(*NAVY)
    pdf.rect(14, 128, 269, 28, "F")
    pdf.set_font("ui", "B", 11)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(20, 132)
    pdf.cell(0, 7, "Visión WOW:  Visitante  →  Destino  →  Emprendimiento local  →  Comunidad  →  Patrimonio cuidado")
    pdf.set_font("ui", "", 9)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(20, 142)
    pdf.cell(0, 7, "CONEXIÓN    INGRESO LOCAL    EXPERIENCIA    CONSERVACIÓN    DECISIÓN DEL VIAJERO")

    chips = ["DESTINO", "MAPA", "EMPRENDEDOR", "COMUNIDAD", "PATRIMONIO", "CLIMA", "SELLO", "RUTAS", "ALERTAS", "IA"]
    x = 14
    pdf.set_font("ui", "B", 8)
    for i, c in enumerate(chips):
        color = [BLUE, GREEN, ORANGE, NAVY][i % 4]
        pdf.set_fill_color(*color)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(x, 164)
        pdf.cell(26, 8, c, fill=True, align="C")
        x += 28


def page_ganadora(pdf: PDF):
    pdf.add_page()
    pdf.page_header(8, "Idea ganadora y mejoras necesarias")
    pdf.footer_bar()

    pdf.set_fill_color(*GREEN)
    pdf.rect(14, 22, 269, 28, "F")
    pdf.set_font("ui", "", 9)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(20, 24)
    pdf.cell(0, 6, "IDEA SELECCIONADA  ·  D8 TURISMO SOSTENIBLE")
    pdf.set_font("ui", "B", 16)
    pdf.set_xy(20, 31)
    pdf.cell(0, 8, "GEOTURISMO EMPRENDEDOR")
    pdf.set_font("ui", "", 9)
    pdf.set_xy(20, 40)
    pdf.cell(0, 6, "La conexión más directa entre visitante, comunidad, ingreso local y cuidado del destino.")

    pdf.set_font("ui", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.set_xy(14, 54)
    pdf.multi_cell(
        269,
        5,
        "No es la idea más automática ni la más “tecnológica”, pero es la que mejor responde al reto: conectar "
        "visitantes con emprendimientos y experiencias locales. El prototipo ya muestra destinos; lo que falta "
        "para el D8 es dar voz a quien vive y trabaja en el lugar.",
    )

    pdf.set_font("ui", "B", 11)
    pdf.set_text_color(*NAVY)
    pdf.set_xy(14, 70)
    pdf.cell(0, 6, "Riesgos y mejoras prioritarias")

    risks = [
        ("1  Emprendimientos no verificados",
         "Moderar altas: el administrador valida identidad y lugar antes de publicar. Evitar perfiles falsos."),
        ("2  Demasiadas funcionalidades",
         "MVP: Destino → Emprendimientos cercanos → Contacto/horario/costo → Mapa. Pagos, IA y sello oficial después."),
        ("3  Patrimonio solo como telón de fondo",
         "Cada experiencia debe indicar buenas prácticas y si aporta a conservar naturaleza o cultura del sitio."),
        ("4  Validación insuficiente",
         "Probar con emprendedores reales y con viajeros: ¿encontraron a quién contratar? ¿el destino se saturó menos?"),
    ]
    y = 78
    for t, d in risks:
        pdf.set_fill_color(*BG)
        pdf.rect(14, y, 269, 14, "F")
        pdf.set_font("ui", "B", 9)
        pdf.set_text_color(*GREEN)
        pdf.set_xy(18, y + 1)
        pdf.cell(260, 5, t)
        pdf.set_font("ui", "", 8.5)
        pdf.set_text_color(*DARK)
        pdf.set_xy(18, y + 7)
        pdf.cell(260, 5, d)
        y += 16

    pdf.set_fill_color(*NAVY)
    pdf.rect(14, y + 2, 269, 34, "F")
    pdf.set_font("ui", "B", 9)
    pdf.set_text_color(*ORANGE)
    pdf.set_xy(20, y + 4)
    pdf.cell(0, 5, "Recomendación final para #NoLimits")
    pdf.set_font("ui", "I", 8.5)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(20, y + 10)
    pdf.multi_cell(
        257,
        4.4,
        "“Si tuviéramos que apostar por una sola idea para el D8 · Turismo Sostenible, elegiríamos GeoTurismo "
        "Emprendedor porque conecta visitantes con comunidades y experiencias locales, genera oportunidades "
        "económicas en el destino y, al visibilizar a quien cuida el lugar, contribuye a conservar el patrimonio "
        "natural y cultural sin depender de infraestructura costosa.”",
    )

    pdf.set_font("ui", "B", 9)
    pdf.set_text_color(*NAVY)
    pdf.set_xy(14, 186)
    pdf.cell(0, 6, "Concepto central:  El turismo crece cuando el visitante encuentra a la comunidad, no solo al paisaje.")


def main():
    pdf = PDF()
    cover(pdf)
    page_objetivo(pdf)
    page_lluvia(pdf)
    page_cocd(pdf)
    page_finalistas(pdf)
    page_evaluacion(pdf)
    page_justificacion(pdf)
    page_cono(pdf)
    page_ganadora(pdf)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(f"OK {OUT}")


if __name__ == "__main__":
    main()
