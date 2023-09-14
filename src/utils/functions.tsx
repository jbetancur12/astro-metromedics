export const getIdFromUrl = (position: number = -1): string  => {
  const url:string = window.location.href
  const parts: string[] = url.split('/');
  const index: number = position >= 0 ? position : parts.length + position;

  if (index >= 0 && index < parts.length) {
    return parts[index];
  } else {
    // Devuelve el último slug si la posición especificada no es válida
    return parts[parts.length - 1];
  }
}