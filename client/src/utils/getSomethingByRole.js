export const getBorderColorByRole = (role) => {
    switch (role) {
      case 'Мафія':
        return '3.5px solid #A71616';
      case 'Комісар':
        return '3.5px solid #FBBC04';
      case 'Дон':
        return '3.5px solid rgb(109,12,38)';
      case 'Коханка':
        return '3.5px solid #A7168C';
      case 'Доктор':
        return '3.5px solid #166BA7';
      case 'Безхатько':
        return '3.5px solid rgb(71,175,122)';
      case 'Самогубець':
        return '3.5px solid rgb(171,171,214)';
      case 'Камікадзе':
        return '3.5px solid rgb(138,101,153)';
      case 'Адвокат':
        return '3.5px solid rgb(0,64,40)';
      case 'Маніак':
        return '3.5px solid rgb(84, 4, 163)';
      case 'Сержант':
        return '3.5px solid rgb(219,188,94)';
      default:
        return '3.5px solid white';
    }
  };