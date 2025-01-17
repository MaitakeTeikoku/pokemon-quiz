// 重複なしのランダムな番号を取得
const getRandomNumbers = (count: number, max: number): number[] => {
  // 入力値の検証
  if (!Number.isInteger(count) || !Number.isInteger(max)) {
    throw new Error('count と max は整数である必要があります');
  }
  if (count < 0 || max < 0) {
    throw new Error('count と max は正の数である必要があります');
  }
  if (count > max) {
    throw new Error('count は max 以下である必要があります');
  }
  
  const numbers = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers.slice(0, count);
};

export default getRandomNumbers;
