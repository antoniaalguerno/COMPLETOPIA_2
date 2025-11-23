import re
import difflib

# ---------------------------
# 1) Base de conocimiento
# ---------------------------

FAQS = {
    "horario": "Atendemos de lunes a sábado, de 12:00 a 22:00 hrs. ¡Ideales para el bajón!",
    "envios": "Sí, tenemos delivery propio en la comuna y también estamos en Apps (Uber/PedidosYa).",
    "factura": "Por supuesto. Envíanos tu RUT y giro al correo facturacion@completopia.cl.",
    "medios de pago": "Aceptamos efectivo, Redcompra (Débito/Crédito) y Sodexo.",
    "ubicacion": "Estamos en Av. Siempre Viva 742 (cerca del metro).",
    "carta": "Tenemos Italianos, Dinámicos, As (carne), y papas fritas. ¡El Italiano es el rey!",
    "promo": "La promo del día es: 2 Italianos + Bebida por $5.990."
}

FAQ_QUESTIONS = list(FAQS.keys())

# ---------------------------
# 2) Sinónimos y Palabras Clave
# ---------------------------

GREETINGS = {"hola", "wenas", "buenos dias", "buenas", "que tal", "hello"}
BYE = {"chao", "adios", "gracias", "nos vemos"}

KEYWORDS = {
    "horario": {"horario", "hora", "abren", "cierran", "apertura"},
    "precios": {"precio", "costo", "vale", "valor", "carta", "menu"},
    "envios": {"envio", "delivery", "domicilio", "uber", "pedidosya"},
    "factura": {"factura", "boleta"},
    "pago": {"pago", "pagar", "tarjeta", "redcompra", "efectivo", "sodexo"},
    "ubicacion": {"ubicacion", "donde", "direccion", "calle", "lugar"},
    "pedido": {"pedido", "orden", "seguimiento", "tracking", "mi completo"},
    "humano": {"humano", "persona", "ejecutivo", "alguien"}
}

# ---------------------------
# 3) Plantillas de Respuesta
# ---------------------------

TEMPLATES = {
    "greeting": "¡Hola! Bienvenido a Completopia 🌭. ¿Te provoca un Italiano o necesitas ayuda con un pedido?",
    "fallback": "Mmm, no entendí bien (estaba pensando en vienesas). ¿Podrías preguntarlo de otra forma?",
    "hours": FAQS["horario"],
    "menu": FAQS["carta"],
    "promo": FAQS["promo"],
    "shipping": FAQS["envios"],
    "invoice": FAQS["factura"],
    "payment": FAQS["medios de pago"],
    "location": FAQS["ubicacion"],
    "human": "Entendido. Un maestro sanguchero (humano) te responderá en breve. Espera unos minutos.",
    "order_need_number": "¿Tienes tu número de pedido a mano? (Ej: #1234)",
    "order_status": "El pedido #{order_id} está **EN PLANCHA** 🔥. ¡Pronto saldrá a reparto!"
}

# ---------------------------
# 4) Clase Principal
# ---------------------------

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())

def contains_any(text: str, bag: set) -> bool:
    return any(word in text for word in bag)

def best_faq_match(user_text: str, threshold: float = 0.65):
    user_text = normalize(user_text)
    match = difflib.get_close_matches(user_text, FAQ_QUESTIONS, n=1, cutoff=threshold)
    if match:
        return FAQS[match[0]]
    return None

class CompletoBot:
    def __init__(self, waiting_order_state=False):
        self.waiting_order = waiting_order_state
        self.new_state = waiting_order_state

    def handle_message(self, text: str) -> str:
        msg = normalize(text)

        if self.waiting_order:
            order_id = self._extract_order_id(msg)
            if order_id:
                self.new_state = False
                return TEMPLATES["order_status"].format(order_id=order_id)
            else:
                if "no" in msg or "cancelar" in msg:
                    self.new_state = False
                    return "No te preocupes. ¿En qué más te ayudo?"
                return "No encontré un número ahí. Intenta escribir solo el número (ej: 1045)."

        if contains_any(msg, BYE):
            return "¡Chao! Que disfrutes tus completos. 🌭"
        if contains_any(msg, GREETINGS):
            return TEMPLATES["greeting"]

        if contains_any(msg, KEYWORDS["horario"]): return TEMPLATES["hours"]
        if contains_any(msg, KEYWORDS["precios"]): return f"{TEMPLATES['menu']} {TEMPLATES['promo']}"
        if contains_any(msg, KEYWORDS["envios"]): return TEMPLATES["shipping"]
        if contains_any(msg, KEYWORDS["factura"]): return TEMPLATES["invoice"]
        if contains_any(msg, KEYWORDS["pago"]): return TEMPLATES["payment"]
        if contains_any(msg, KEYWORDS["ubicacion"]): return TEMPLATES["location"]
        if contains_any(msg, KEYWORDS["humano"]): return TEMPLATES["human"]

        if contains_any(msg, KEYWORDS["pedido"]):
            self.new_state = True
            return TEMPLATES["order_need_number"]

        ans = best_faq_match(msg)
        if ans: return ans

        return TEMPLATES["fallback"]

    @staticmethod
    def _extract_order_id(text: str):
        m = re.search(r"#?(\d{3,10})", text)
        return m.group(1) if m else None