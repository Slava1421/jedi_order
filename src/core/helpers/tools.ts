export function generateAvatar(name: string): string {
  const initials = name.split(' ').map((str) => str ? str[0].toUpperCase() : '').join('');
  const canvas = document.createElement('canvas');
  const radius = 20;
  const margin = 5;
  canvas.width = radius * 2 + margin * 2;
  canvas.height = radius * 2 + margin * 2;
  // Get the drawing context 
  const ctx = canvas.getContext('2d');
  ctx?.beginPath()
  ctx?.arc(radius + margin, radius + margin, radius, 0, 2 * Math.PI, false);
  ctx?.closePath();
  ctx!.fillStyle = _generateBackgroundByLetter(initials[0]);
  ctx?.fill();
  ctx!.fillStyle = 'white';
  ctx!.font = 'bold 18px Comic sans MS';
  ctx!.textAlign = 'center';
  ctx?.fillText(initials, radius + 5, radius * 4 / 3 + margin); return canvas.toDataURL();
}

function _generateBackgroundByLetter(letter: string): string {
  letter = letter.toLocaleUpperCase();
  const alphabet1 = ['А', 'Б', 'В', 'Г', 'Ґ', 'Д', 'A', 'B', 'C', 'D',];
  const alphabet2 = ['Е', 'Є', 'Ж', 'З', 'И', 'І', 'E', 'F', 'G', 'H',];
  const alphabet3 = ['Ї', 'Й', 'К', 'Л', 'М', 'Н', 'I', 'J', 'K', 'L',];
  const alphabet4 = ['О', 'П', 'Р', 'С', 'Т', 'У', 'M', 'N', 'O', 'P',];
  const alphabet5 = ['Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Q', 'R', 'S', 'T',];
  const alphabet6 = ['Ю', 'Я', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  switch (letter) {
    case alphabet1.find(f => f === letter):
      return '#5a8778';
    case alphabet2.find(f => f === letter):
      return '#667192';
    case alphabet3.find(f => f === letter):
      return '#826850';
    case alphabet4.find(f => f === letter):
      return '#7d5082';
    case alphabet5.find(f => f === letter):
      return '#805151';
    case alphabet6.find(f => f === letter):
      return '#806051';

    default:
      return 'grey';
  }
}

export function combineTransforms(transform: string, initialTransform?: string): string {
  return initialTransform && initialTransform != 'none'
    ? transform + ' ' + initialTransform
    : transform;
}

export function globalTheme(): (themeClassName: string) => void {
  let currentThemeClassName = '';

  return (themeClassName: string) => {
    if (currentThemeClassName !== themeClassName) {
      document.body.classList.add(themeClassName);

      if (!!currentThemeClassName) {
        document.body.classList.remove(currentThemeClassName);
      }
      currentThemeClassName = themeClassName;

    }
  }
}

export function isNonEmptyObject(variable: any) {
  return typeof variable === 'object' && variable !== null && Object.keys(variable).length > 0;
}