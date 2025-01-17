import { ColorScheme } from "@yamada-ui/react";

// スコアの色
const getScoreColor = (score: number, currentQuestion: number): ColorScheme => {
  const normalizedScore = (score / currentQuestion) * 100;

  if (normalizedScore >= 100) {
    return "emerald.500";
  } else if (normalizedScore >= 90) {
    return "green.500";
  } else if (normalizedScore >= 70) {
    return "lime.500";
  } else if (normalizedScore >= 50) {
    return "yellow.500";
  } else if (normalizedScore >= 30) {
    return "orange.500";
  } else {
    return "rose.500";
  }
};

export default getScoreColor;
