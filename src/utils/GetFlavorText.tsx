interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface PokemonName {
  language: {
    name: string;
  };
  name: string;
}

// ポケモンの日本語のフレーバーテキストを取得
const getFlavorText = async (dexNumber: number): Promise<string | null> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dexNumber}`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    const flavorTextEntries: FlavorTextEntry[] = data.flavor_text_entries;

    // 日本語のフレーバーテキストを抽出
    const japaneseTexts = flavorTextEntries.filter(
      (entry) => entry.language.name === "ja"
    );

    // ポケモン名を取得 (日本語)
    const pokemonNames: PokemonName[] = data.names.filter(
      (entry: PokemonName) => entry.language.name === "ja"
    );

    // ランダムに1つ選択し、置換を適用
    if (japaneseTexts.length > 0 && pokemonNames.length > 0) {
      const randomEntry = japaneseTexts[Math.floor(Math.random() * japaneseTexts.length)];
      const pokemonName = pokemonNames[0].name;

      // フレーバーテキストからポケモン名を伏字にする
      const maskedText = randomEntry.flavor_text.replace(new RegExp(pokemonName, 'g'), '【？？？？？？】');
      
      // 改行や特殊文字を置換
      //const cleanedText = maskedText.replace(/\n|\f/g, " ");
      return maskedText;
    } else {
      return null;
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : "不明なエラー [getFlavorText]";
    console.error(error);
    return null;
  }
};

export default getFlavorText;
