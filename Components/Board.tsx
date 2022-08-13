import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Board: React.FC = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [turn, setTurn] = useState<boolean>(true);
	const [player, setPlayer] = useState<number[]>([]);
	const [bot, setBot] = useState<number[]>([]);
	const [winner, setWinner] = useState<string>("");
	const [win, setWin] = useState<boolean>(false);
	const [xWin, setXWin] = useState<number>(0);
	const [oWin, setOWin] = useState<number>(0);

	const boardAnimate = {
		hidden: { opacity: 0, scale: 0.5 },
		visible: { opacity: 1, scale: 1 },
		exit: {
			opacity: 0,
			scale: 0.5,
		},
	};

	const winAnimate = {
		hidden: { opacity: 0, scale: 0.5 },
		visible: {
			opacity: 1,
			scale: 1,
		},
		exit: {
			opacity: 0,
			scale: 0.5,
		},
	};

	const boardReset = () => {
		setWin(false);
		setPlayer([]);
		setBot([]);
		setTurn(true);
	};

	useEffect(() => {
		const winPatterns = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		if (
			winPatterns.some((pattern) => pattern.every((id) => bot.includes(id)))
		) {
			setWinner("O");
			setWin(true);
			setOWin((o) => o + 1);
		} else if (
			winPatterns.some((pattern) => pattern.every((id) => player.includes(id)))
		) {
			setWinner("X");
			setWin(true);
			setXWin((x) => x + 1);
		} else if (player.length >= 4 && bot.length >= 4) {
			setWinner("draw");
			setWin(true);
		}
	}, [player, bot]);

	const handleTurn = (event: React.MouseEvent<HTMLElement>, index: number) => {
		let target = event.target as HTMLElement;
		let playerScore: number[] = [...player];
		let botScore: number[] = [...bot];

		target.innerHTML = turn ? "X" : "O";
		target.style.pointerEvents = "none";

		if (turn) {
			setTurn(false);
			playerScore.push(index);
			setPlayer(playerScore);
		} else {
			setTurn(true);
			botScore.push(index);
			setBot(botScore);
		}
	};
	return (
		<>
			<AnimatePresence>
				{win && (
					<motion.div
						className="win"
						variants={winAnimate}
						initial="hidden"
						animate="visible"
					>
						<div>
							{winner}
							{winner !== "draw" && <p>WINNER</p>}
							<p>
								X:{xWin} O: {oWin}
							</p>
							<div className="win__btn" onClick={boardReset}>
								Restart
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{!win && (
					<motion.div
						className="game"
						variants={boardAnimate}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<div className="game__inner">
							{board.map((item, index) => (
								<div
									className="game__item"
									key={index}
									onClick={(event) => handleTurn(event, index)}
								></div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Board;
