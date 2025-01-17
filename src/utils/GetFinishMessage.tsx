// ゲーム終了メッセージ
const getFinishMessage = (score: number, TOTAL_QUESTIONS: number): string => {
  const normalizedScore = (score / TOTAL_QUESTIONS) * 100;

  if (normalizedScore >= 100) {
    return "さいこう！";
  } else if (normalizedScore >= 90) {
    return "すばらしい！";
  } else if (normalizedScore >= 70) {
    return "すごくいい！";
  } else if (normalizedScore >= 50) {
    return "かなりいい！";
  } else if (normalizedScore >= 30) {
    return "まぁまぁ";
  } else {
    return "ダメかも...";
  }
};

export default getFinishMessage;
