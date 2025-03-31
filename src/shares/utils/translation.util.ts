export const mapTranslation = (item) => {
  return {
    ...item,
    translations: undefined,
    ...Object.fromEntries(item.translations.map((t) => [t.field, t.value])),
  };
};

export const faqTranslation = (items) => {
  const faqArray = [];
  let currentPair: any = {};
  
  items.forEach(item => {
    if (item.field === 'title') {
      if (currentPair.title) {
        faqArray.push(currentPair);
      }
      currentPair = { title: item.value };
    } 
    else if (item.field === 'description') {
      currentPair.description = item.value;
      faqArray.push(currentPair);
      currentPair = {};
    }
  });
  
  if (currentPair.title) {
    faqArray.push(currentPair);
  }
  
  return faqArray;
};