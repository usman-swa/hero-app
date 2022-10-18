import { useState, useEffect } from "react";

import { Deck } from "../App";
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CircularProgress } from "@mui/material";

interface DeckProps {
	deck: Deck
};

interface Card {
	imagesrc: string,
	code: string,
	text: string,
	name: string,
	threat: number,
	willpower: number,
	health: number,
	pack_name: string,
	flavor: string
};

const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	minWidth: '300px',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
  };

const getCardRequest = (id: string) => {
    const url = "https://ringsdb.com/api/public/card/" + id;

    return new Promise(resolve => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch((error) => {
                resolve(error);
            });
    });
}

const getCard = async (key: string) => {
    let fetchData = (await getCardRequest(key)) as Card;

    if (!fetchData) {
        return undefined;
    } else {
        return fetchData;
    }
};

export const DeckView = ({ deck }: DeckProps) => {
	const [currentCardInfo, setCurrentCardInfo] = useState({} as Card);
	const [deckTitle, setDeckTitle] = useState('');
	const [heroCards, setHeroCards] = useState<(Card | undefined)[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = React.useState(false);
  	const handleClose = () => setOpen(false);

	useEffect(() => {
		setIsLoading(true);
		const getHeroCards = async (heros: { id: number }[]) => {
			const fetchedCards = await Promise.all(
				Object.keys(heros).map((key) => {
					return getCard(key);
				})
			);
			setHeroCards(fetchedCards);
		};
		getHeroCards(deck.heroes);
		setDeckTitle(deck.name);
	}, [deck]);

	const showCardInfo = (selectedCard: Card | undefined) => {
		if (selectedCard) {
			setCurrentCardInfo(selectedCard);
			setOpen(true);
		}
	};
	const imageLoaded = () => {
		setIsLoading(false);
	};

	return (
		<div>
			{isLoading ? <CircularProgress /> : deckTitle}
			<Box sx={{ display: 'flex' }}>
				{heroCards.map((card, _) => {
					return (
						<div key={card?.name}>
							<img
								id={card?.name}
								src={"https://ringsdb.com" + card?.imagesrc}
								alt=""
								onClick={() => {
									showCardInfo(card);
								}}
								onLoad={imageLoaded}
							/>
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
								<Box sx={modalStyle}>
									<Box sx={{ display: 'flex', columnGap: '24px' }}>
										<div>
											<h2>{currentCardInfo.name}</h2>
											<img src={"https://ringsdb.com" + currentCardInfo.imagesrc} alt="card" />
										</div>
										<div style={{ marginTop: '60px' }}>
											<b>{currentCardInfo.name}</b> <br />
											<br />
											Threat: {currentCardInfo.threat} <br />
											Willpower: {currentCardInfo.willpower} <br />
											Health: {currentCardInfo.health} <br />
											<br />
											Pack: {currentCardInfo.pack_name} <br />

											<p dangerouslySetInnerHTML={{ __html: currentCardInfo.flavor }} />
										</div>
									</Box>
								</Box>
							</Modal>
						</div>
					);
				})}
			</Box>
		</div>
	);
};
