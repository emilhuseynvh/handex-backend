export const mapTranslation = (item) => {
  let translations = {
    ...item,
    translations: undefined,
    ...Object.fromEntries(item.translations.map((t) => [t.field, t.value])),
  };

  return translations;
};

export const blogTranslations = (items) => {
  console.log(items);
  
  const faqArray = [];
  let currentPair: any = {};

  items.forEach(item => {
    if (item.field === 'name') {
      currentPair.name = item.value;
      if (currentPair.value) {
        faqArray.push(currentPair);
        currentPair = {};
      }
    }
    else if (item.field === 'value') {
      currentPair.value = item.value;
      if (currentPair.name) {
        faqArray.push(currentPair);
        currentPair = {};
      }
    }
  });
  
  if (currentPair.title) {
    faqArray.push(currentPair);
  }

  return faqArray;
};

export const faqTranslation = (items) => {
  console.log(items);
  
  const faqArray = [];
  let currentPair: any = {};

  items.forEach(item => {
    if (item.field === 'title') {
      currentPair.title = item.value;
      if (currentPair.description) {
        faqArray.push(currentPair);
        currentPair = {};
      }
    }
    else if (item.field === 'description') {
      currentPair.description = item.value;
      if (currentPair.title) {
        faqArray.push(currentPair);
        currentPair = {};
      }
    }
  });
  
  if (currentPair.title) {
    faqArray.push(currentPair);
  }

  return faqArray;
};

export const metaTranslations = (items) => {
  const result = [];
  let valueItem = null;
  let nameItem = null;

  const sortedItems = [...items].sort((a, b) => a.id - b.id);

  for (const item of sortedItems) {
    if (item.field === "value") {
      valueItem = item;
    } else if (item.field === "name") {
      nameItem = item;
    }

    if (valueItem && nameItem) {
      result.push({
        id: nameItem.id,
        slug: "home",
        name: nameItem.value,
        value: valueItem.value
      });

      valueItem = null;
      nameItem = null;
    }
  }

  return result;
};