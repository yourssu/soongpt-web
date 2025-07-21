type Entry = [RegExp, string];

const formatByEntries = (val: string, entries: Entry[]) => {
  for (const [regex, replacer] of entries) {
    if (regex.test(val)) {
      return val.replace(regex, replacer);
    }
  }
  return val;
};

export const toPhoneNumber = (numText: string) => {
  if (numText.startsWith('02')) {
    return formatByEntries(numText, [
      [/(^02)(\d{3})(\d{1,4})$/, '$1-$2-$3'],
      [/(^02)(\d{4})(\d{1,4})$/, '$1-$2-$3'],
      [/(^02)(\d{4})(\d{4})\d+$/, '$1-$2-$3'],
      [/(^02)(\d{1,4})$/, '$1-$2'],
    ]);
  }

  return formatByEntries(numText, [
    [/(^\d{3})(\d{3})(\d{1,4})$/, '$1-$2-$3'],
    [/(^\d{3})(\d{4})(\d{1,4})$/, '$1-$2-$3'],
    [/(^\d{3})(\d{4})(\d{4})\d+$/, '$1-$2-$3'],
    [/(^\d{3})(\d{1,4})$/, '$1-$2'],
  ]);
};
