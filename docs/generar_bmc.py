"""Business Model Canvas — GeoTurismoSV · D8 Turismo Sostenible (A4 horizontal)."""

from pathlib import Path

from fpdf import FPDF

OUT = Path(r"C:\Users\jhoan\Downloads\GeoTurismoSV_Business_Model_Canvas.pdf")
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
LINE = (210, 220, 230)


class PDF(FPDF):
    def __init__(self):
        super().__init__(orientation="L", unit="mm", format="A4")
        self.set_auto_page_break(False)
        self.add_font("ui", "", FONT)
        self.add_font("ui", "B", FONT_B)
        self.add_font("ui", "I", FONT_I)

    def box(self, x, y, w, h, title, items, color=BLUE, lead=None):
        self.set_draw_color(*LINE)
        self.set_fill_color(*BG)
        self.rect(x, y, w, h, "FD")
        self.set_fill_color(*color)
        self.rect(x, y, w, 8, "F")
        self.set_font("ui", "B", 8)
        self.set_text_color(*WHITE)
        self.set_xy(x + 2, y + 1.5)
        self.cell(w - 4, 5, title)
        self.set_text_color(*DARK)
        yy = y + 10
        if lead:
            self.set_font("ui", "B", 7)
            self.set_xy(x + 2, yy)
            self.multi_cell(w - 4, 3.4, lead)
            yy = self.get_y() + 1
        self.set_font("ui", "", 7)
        self.set_text_color(*MUTED)
        for item in items:
            if yy > y + h - 6:
                break
            self.set_xy(x + 2, yy)
            self.multi_cell(w - 4, 3.3, f"•  {item}")
            yy = self.get_y() + 0.4


def main():
    pdf = PDF()
    pdf.add_page()

    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 297, 14, "F")
    pdf.set_fill_color(*ORANGE)
    pdf.rect(0, 14, 297, 1.1, "F")
    pdf.set_font("ui", "B", 12)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(10, 3)
    pdf.cell(180, 8, "Business Model Canvas  ·  GeoTurismoSV")
    pdf.set_font("ui", "", 8)
    pdf.set_text_color(180, 200, 220)
    pdf.set_xy(175, 3)
    pdf.cell(112, 8, "Geografía del lugar + quien lo habita", align="R")

    # Layout: partners | act/res | value | rel/chan | segments
    # bottom: costs | revenue
    pdf.box(
        8, 18, 52, 128, "Socios clave (colaboraciones)",
        [
            "Quienes conocen el territorio: guías locales y comunidades anfitrionas",
            "Emprendimientos del lugar: hostales, artesanos, gastronomía de cada destino",
            "El equipo: cura qué sitios entran al mapa de El Salvador",
            "Capa geo ya usada: Leaflet (mapa) y Open-Meteo (clima del sitio)",
        ],
        BLUE,
    )
    pdf.box(
        62, 18, 52, 62, "Actividades clave",
        [
            "Mapear destinos: ubicación, clima y carácter del lugar",
            "Contar el sitio (naturaleza, cultura, cómo llegar)",
            "Etiquetar cada experiencia por dominio de edad",
            "Verificar que el emprendedor sí opera en ese territorio",
            "Cuidar el patrimonio: visita responsable al geositio",
        ],
        GREEN,
    )
    pdf.box(
        62, 82, 52, 64, "Recurso clave",
        [
            "El mapa de El Salvador (coords, destinos, clima)",
            "Catálogo geoturístico: volcanes, playas, pueblos, sitios culturales",
            "Plataforma web Vue + Supabase",
            "Equipo de 8 que conoce y carga el territorio",
            "TTS y ES/EN para leer el lugar",
        ],
        GREEN,
    )
    pdf.box(
        116, 18, 64, 128, "Propuesta de valor",
        [
            "El mapa no es adorno: es el territorio.",
            "Una web, cinco lecturas del mismo país — no cinco productos.",
            "Niños: geografía segura y educativa (familia)",
            "Adolescencia: geografía de aventura y grupos",
            "Adultos: geografía vivida con el emprendedor local",
            "Mayores: geografía accesible, ritmo y patrimonio",
            "Global: todo el mapa GeoTurismoSV",
        ],
        ORANGE,
        lead="GeoTurismo es visitar un lugar por lo que es: su geografía, clima, cultura y la comunidad que lo habita. GeoTurismoSV lo hace visible en El Salvador.",
    )
    pdf.box(
        182, 18, 52, 62, "Relaciones con clientes",
        [
            "Explorar el territorio en autoservicio (mapa)",
            "Guardar destinos en favoritos",
            "El anfitrión publica su experiencia en el sitio",
            "Admin valida que el lugar y la ficha coincidan",
            "Lenguaje claro, bilingüe, con lectura en voz alta",
        ],
        BLUE,
    )
    pdf.box(
        182, 82, 52, 64, "Canales",
        [
            "La web-mapa: puerta al territorio",
            "Cinco entradas: niños, adolescentes, adultos, mayores y Global",
            "La ficha del destino + el emprendedor del lugar",
            "Boca a boca y redes, cuando el mapa ya tenga uso",
        ],
        BLUE,
    )
    pdf.box(
        236, 18, 53, 128, "Segmentos de cliente",
        [
            "Quienes quieren leer El Salvador en el mapa",
            "Familias: geografía para niños",
            "Adolescentes: aventura en el territorio",
            "Adultos: experiencias con gente del lugar",
            "Adultos mayores: patrimonio a su ritmo",
            "Dominio Global: todo público",
            "Anfitriones: emprendedores y comunidades del destino",
        ],
        NAVY,
    )
    pdf.box(
        8, 148, 140, 40, "Estructura de costes",
        [
            "Mantener vivo el mapa: cargar destinos, coords, clima y textos",
            "Tiempo del equipo (8 personas) y hosting Supabase + dominio",
            "Sin sensores, drones ni app nativa: el geo es software y curaduría",
        ],
        MUTED,
    )
    pdf.box(
        150, 148, 139, 40, "Fuentes de ingresos",
        [
            "Hoy: prototipo académico; el valor es hacer visible el territorio",
            "Después: destacar la experiencia geoturística del emprendedor en un destino",
            "Comisión baja por conectar visita y anfitrión — no ahora",
        ],
        MUTED,
    )

    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 200, 297, 10, "F")
    pdf.set_font("ui", "", 7.5)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(10, 202.5)
    pdf.cell(
        277,
        5,
        "GeoTurismo = carácter geográfico del lugar (mapa, clima, paisaje, cultura) + quien lo habita.  ·  Dominios = lecturas del mismo mapa.",
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    print(f"OK {OUT}")


if __name__ == "__main__":
    main()
