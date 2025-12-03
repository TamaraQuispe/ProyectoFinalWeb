export class Validators {
  // Validar nombre y apellido (solo letras, mínimo 2 caracteres)
  static validateName(name) {
    if (!name) return "Este campo es obligatorio";
    if (!/^[a-zA-Z\s]{2,}$/.test(name)) return "Mínimo 2 letras, solo letras";
    return "";
  }

  // Validar correo
  static validateEmail(email) {
    if (!email) return "Este campo es obligatorio";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Correo no válido";
    return "";
  }

  // Validar celular (exactamente 9 dígitos, sin espacios ni caracteres especiales)
  static validateCelular(celular) {
    if (!celular) return "Este campo es obligatorio";
    const trimmed = celular.trim();
    if (!/^\d{9}$/.test(trimmed)) return "Número de celular debe tener 9 dígitos";
    return "";
  }

  // Validar dirección (mínimo 3 caracteres)
  static validateDireccion(direccion) {
    if (!direccion) return "Este campo es obligatorio";
    if (direccion.length < 3) return "Dirección demasiado corta";
    return "";
  }

  // Validar DNI (exactamente 8 dígitos, sin espacios ni caracteres especiales)
  static validateDNI(dni) {
    if (!dni) return "Este campo es obligatorio";
    const trimmed = dni.trim();
    if (!/^\d{8}$/.test(trimmed)) return "DNI debe tener 8 dígitos";
    return "";
  }

  // Validar contraseña (mínimo 6 caracteres)
  static validatePassword(password) {
    if (!password) return "Este campo es obligatorio";
    if (password.length < 6) return "Mínimo 6 caracteres";
    return "";
  }
}