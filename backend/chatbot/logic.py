import re
import difflib
import random

# ---------------------------
# CONFIGURACIÓN Y DATOS
# ---------------------------

# Estados del flujo de conversación
STEP_IDLE = 'IDLE'             # Esperando que hable
STEP_SELECT_PRODUCT = 'PROD'   # Esperando que elija comida
STEP_SELECT_DRINK = 'DRINK'    # Esperando que elija bebida
STEP_CONFIRM = 'CONFIRM'       # Esperando confirmación final
STEP_TRACKING = 'TRACKING'     # Esperando número de seguimiento

# Menú con precios
MENU = {
    "italiano": 2300,
    "dinamico": 2500,
    "as": 3200,
    "papas fritas": 1500
}

DRINKS = {
    "coca": 1200,
    "fanta": 1200,
    "sprite": 1200,
    "jugo": 1000,
    "agua": 800,
    "nada": 0 
}

# Palabras clave generales
KEYWORDS = {
    "pedir": {"quiero", "dame", "ordenar", "pedir", "hambre", "comprar"},
    "cancelar": {"cancelar", "chao", "olvidalo", "salir", "reiniciar"},
    "tracking": {"seguimiento", "donde viene", "pedido", "estado"},
    # Agregamos 'bebestibles' al menu general tambien
    "menu": {"carta", "precios", "menu", "precio", "tienen", "valor", "vale"},
    # NUEVO: Palabras específicas para bebidas
    "bebidas": {"bebida", "bebestible", "sed", "tomar", "refresco", "jugo", "agua", "coca", "fanta"}
}

# ---------------------------
# UTILIDADES
# ---------------------------

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())

def contains_any(text: str, bag: set) -> bool:
    return any(word in text for word in bag)

def match_product(text: str, database: dict):
    # Busca la mejor coincidencia en el menú
    match = difflib.get_close_matches(text, list(database.keys()), n=1, cutoff=0.5)
    return match[0] if match else None

# NUEVO: formatea precios con separador de miles y signo $
def format_price(value: int) -> str:
    return f"${value:,}".replace(",", ".")

# ---------------------------
# CLASE PRINCIPAL
# ---------------------------

class CompletoBot:
    def __init__(self, context=None):
        if context is None:
            context = {}
        
        self.state = context.get('state', STEP_IDLE)
        self.current_order = context.get('order', {}) 

    def get_context(self):
        return {
            'state': self.state,
            'order': self.current_order
        }

    def reset_context(self):
        self.state = STEP_IDLE
        self.current_order = {}

    def handle_message(self, text: str) -> str:
        msg = normalize(text)

        # 1. COMANDO GLOBAL: CANCELAR
        if contains_any(msg, KEYWORDS["cancelar"]):
            self.reset_context()
            return "❌ Pedido cancelado. Volvimos al inicio. ¿En qué te ayudo?"

        # 2. MÁQUINA DE ESTADOS
        if self.state == STEP_IDLE:
            return self._handle_idle(msg)
        
        elif self.state == STEP_SELECT_PRODUCT:
            return self._handle_select_product(msg)
        
        elif self.state == STEP_SELECT_DRINK:
            return self._handle_select_drink(msg)
        
        elif self.state == STEP_CONFIRM:
            return self._handle_confirm(msg)

        elif self.state == STEP_TRACKING:
            return self._handle_tracking(msg)

        return "Error de estado. Escribe 'cancelar' para reiniciar."

    # -----------------------
    # MANEJADORES DE ESTADO
    # -----------------------

    def _handle_idle(self, msg):
        # A) Quiere pedir
        if contains_any(msg, KEYWORDS["pedir"]):
            self.state = STEP_SELECT_PRODUCT
            menu_str = ", ".join([k.title() for k in MENU.keys()])
            return f"¡Vamos a armar ese pedido! 🌭\n¿Qué te gustaría comer? Tenemos: {menu_str}."

        # B) Quiere ver seguimiento
        if contains_any(msg, KEYWORDS["tracking"]):
            self.state = STEP_TRACKING
            return "¿Cuál es tu número de pedido? (Ej: 1045)"

        # --- C) LÓGICA AGREGADA: BEBIDAS ---
        # Primero preguntamos por bebidas específicamente
        if contains_any(msg, KEYWORDS["bebidas"]):
            # Generamos lista dinámica basada en el diccionario DRINKS
            lines = ["🥤 **Bebidas disponibles:**"]
            for nombre, precio in DRINKS.items():
                if precio > 0: # Ocultamos la opción 'nada'
                    lines.append(f"- {nombre.title()}: ${precio}")
            return "\n".join(lines)
        # -----------------------------------

        # D) Preguntas generales de Comida (Menu)
        if contains_any(msg, KEYWORDS["menu"]):
            return (
                "📜 **Carta de Completos:**\n"
                "- Italiano: $2.300\n"
                "- Dinámico: $2.500\n"
                "- As: $3.200\n"
                "- Papas Fritas: $1.500\n\n"
                "Tip: Pregunta por 'bebidas' para ver los refrescos."
            )
        
        if "horario" in msg:
            return "Abrimos de 12:00 a 22:00 hrs."
        
        if "hola" in msg:
            return "¡Hola! Bienvenido a Completopia 🌭. ¿Te provoca un Italiano?¿Quieres armar tu pedido? o solo veras los precios..."

        return "No entendí bien. Prueba diciendo 'Quiero pedir', 'Ver carta' o 'Precios de bebidas'."

    def _handle_select_product(self, msg):
        product = match_product(msg, MENU)
        
        if product:
            self.current_order['product'] = product
            self.current_order['price'] = MENU[product]
            self.state = STEP_SELECT_DRINK
            return f"¡Excelente elección! Un {product.title()}. 🥤 ¿Qué bebida quieres? (Coca, Fanta, Sprite, Jugo, Agua o escribe 'nada')."
        
        return "Mmm, no tenemos eso en el menú. Intenta con: Italiano, Dinámico, As o Papas Fritas."

    def _handle_select_drink(self, msg):
        drink = match_product(msg, DRINKS) 
        
        if drink:
            self.current_order['drink'] = drink
            self.current_order['drink_price'] = DRINKS[drink]
            
            total = self.current_order['price'] + self.current_order['drink_price']
            self.current_order['total'] = total

            self.state = STEP_CONFIRM
            
            summary = (
                f"📝 **Resumen del Pedido**:\n"
                f"- 1x {self.current_order['product'].title()}\n"
                f"- 1x {self.current_order['drink'].title()}\n"
                f"💰 **Total: ${total}**\n\n"
                f"¿Confirmas el pedido? (Responde Si o No)"
            )
            return summary
        
        return "No entendí la bebida. Tenemos Coca, Fanta, Sprite, Jugo, Agua o 'nada'."

    def _handle_confirm(self, msg):
        if msg in ["si", "sipo", "yes", "confirmar", "dale"]:
            saved_order = self.current_order.copy()
            ticket = random.randint(1, 999)
            self.reset_context() 
            return f"✅ ¡Pedido confirmado! Tu {saved_order['product'].title()} estará listo en 15 minutos. Tu número de ticket es #{ticket}."
        
        elif msg in ["no", "cancelar", "nopo"]:
            self.reset_context()
            return "Pedido cancelado. Avísame si quieres pedir otra cosa."
            
        return "Por favor responde 'Si' para confirmar o 'No' para cancelar."

    def _handle_tracking(self, msg):
        m = re.search(r"\d+", msg)
        if m:
            order_id = m.group(0)
            self.reset_context()
            return f"🔍 Revisando pedido #{order_id}... ¡Está en preparación! 🍳"
        
        return "Necesito un número válido. Intenta de nuevo o escribe 'cancelar'."