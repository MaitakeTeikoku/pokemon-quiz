import { useState, useEffect } from "react";
import {
  Container, HStack, VStack, Spacer,
  Progress,
  DataList, DataListItem, DataListTerm, DataListDescription,
  Badge,
  CircleProgress, CircleProgressLabel,
  Card, Heading, CardHeader, CardBody,
  Text,
  Button,
  Grid,
  Image,
  useNotice,
} from "@yamada-ui/react";
import { getFlavorText } from "./utils/GetFlavorText";
import { getRandomNumbers } from "./utils/GetRandomNumbers";

const TOTAL_QUESTIONS = 10;
const CHOICE_COUNT = 4;
const MAX_POKEMON = 898;

export const App = () => {
  // 処理中かどうか
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // エラーかどうか
  const [isError, setIsError] = useState<boolean>(false);
  // 解答したかどうか
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  // ゲーム終了かどうか
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // 選択肢の図鑑番号
  const [options, setOptions] = useState<number[]>([]);
  // 正解の図鑑番号
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  // 正解のフレーバーテキスト
  const [flavorText, setFlavorText] = useState<string>("");
  // 正解数
  const [score, setScore] = useState<number>(0);
  // 現在の問題数
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const notice = useNotice({
    limit: 2,
    isClosable: true,
    placement: "bottom",
  });

  const loadNewQuestion = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      // 4つのランダムなポケモン番号を取得
      const pokemonNumbers = getRandomNumbers(CHOICE_COUNT, MAX_POKEMON);
      setOptions(pokemonNumbers);

      // その中から正解を1つ選ぶ
      const correctAnswer = pokemonNumbers[Math.floor(Math.random() * CHOICE_COUNT)];
      setCorrectAnswer(correctAnswer);

      // フレーバーテキストを取得
      const flavorText: string | null = await getFlavorText(correctAnswer);

      if (!flavorText) {
        throw new Error("フレーバーテキストの取得に失敗しました");
      }

      setFlavorText(flavorText);

      setIsAnswered(false);
    } catch (e) {
      setIsError(true);

      const error = e instanceof Error ? e.message : "不明なエラー [loadNewQuestion]";
      console.error(error);

      notice({
        title: "エラー",
        description: error,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedNumber: number) => {
    if (isLoading || isAnswered) {
      return;
    }
    setIsLoading(true);
    setIsAnswered(true);

    const isCorrect = selectedNumber === correctAnswer;
    setScore((prev) => (isCorrect ? prev + 1 : prev));

    notice({
      title: isCorrect ? "あたり！" : "はずれ...",
      status: "loading",
      icon: { variant: "puff" },
      variant: "left-accent",
      colorScheme: isCorrect ? "green" : "red",
      duration: 2000,
    });

    // 少し待ってから次の問題へ
    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);
      setIsAnswered(false);

      if (currentQuestion + 1 < TOTAL_QUESTIONS) {
        loadNewQuestion();
      } else {
        setIsFinished(true);
      }

      setIsLoading(false);
    }, 2000);
  };

  const reset = () => {
    setIsLoading(true);
    setIsError(false);
    setIsAnswered(false);
    setIsFinished(false);

    setOptions([]);
    setCorrectAnswer(0);
    setFlavorText("");
    setScore(0);
    setCurrentQuestion(0);

    loadNewQuestion();
  };

  return (
    <>
      <Progress
        value={currentQuestion}
        max={TOTAL_QUESTIONS}
        hasStripe
        isStripeAnimation
      />

      <Container centerContent
        h="100dvh"
      >
        <HStack>
          <DataList col={2} w="fit-content">
            <DataListItem>
              <DataListTerm>解答数</DataListTerm>
              <DataListDescription>{currentQuestion}</DataListDescription>
            </DataListItem>

            <DataListItem>
              <DataListTerm>問題数</DataListTerm>
              <DataListDescription>{TOTAL_QUESTIONS}</DataListDescription>
            </DataListItem>
          </DataList>

          <Spacer />

          <Badge>正解数</Badge>

          <CircleProgress
            value={score}
            max={isLoading ? currentQuestion + 1 : currentQuestion}
          >
            <CircleProgressLabel>{score}</CircleProgressLabel>
          </CircleProgress>

        </HStack>

        {isFinished ? (
          <Card w="full">
            <CardHeader justifyContent="center">
              <Heading size="lg">クイズ終了！</Heading>
            </CardHeader>
            <CardBody>
              <VStack>
                <HStack>
                  <Badge>スコア</Badge>

                  <Spacer />

                  <Text>{score}</Text>
                </HStack>

                <Button onClick={reset}>
                  もう一度プレイ
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <VStack w="full" maxW="4xl" mx="auto" p={4}>
            <Card>
              <CardBody>
                {isError ? (
                  <Button
                    onClick={loadNewQuestion}
                    isDisabled={isLoading}
                    colorScheme="danger"
                  >
                    再読み込み
                  </Button>
                ) : (
                  <Text>{flavorText}</Text>
                )}
              </CardBody>
            </Card>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {options.map((number) => (
                <Button
                  key={number}
                  onClick={() => handleAnswer(number)}
                  isDisabled={isLoading}
                  variant={(isAnswered && number !== correctAnswer) ? "outline" : "solid"}
                  colorScheme={(isAnswered && number === correctAnswer) ? "primary" : undefined}
                  h="150px"
                >
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${number}.png`}
                    alt={`${number}`}
                    objectFit="contain"
                    boxSize="100%"
                  />
                </Button>
              ))}
            </Grid>
          </VStack>
        )}
      </Container >
    </>
  );
};

export default App;
