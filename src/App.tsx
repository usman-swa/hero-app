import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { DeckView } from "./components/DeckView";

export interface Deck {
	name: string,
	heroes: { id: number }[]
};

function App() {
	const [deck, setDeck] = useState<Deck>();
	const [fetchError, setFetchError] = useState(false);
	const [textInputValue, setTextInputValue] = useState('');

	const geDeckRequest = (id: string) => {
		const url = "https://ringsdb.com/api/public/decklist/" + id;
		
		return new Promise((resolve) => {
			fetch(url)
				.then((response) => {
					if (!response.ok) {
						return;
					}

					return response.json()
				})
				.then((data) => {
					resolve(data);
				})
				.catch(() => {
					setFetchError(true);
				});
		});
	};

	const getDeck = async () => {
		const getDeck = (await geDeckRequest(textInputValue)) as Deck;
		if (!getDeck) {
			return;
		}

		setDeck({
			name: getDeck.name,
			heroes: getDeck.heroes,
		});
	};

	return (
		<div>
			<Box sx={{ margin: '40px' }}>
				<h1>My heros</h1>
				<Box>
					<Box
						component="form"
						noValidate
						autoComplete="off"
						sx={{ display: 'flex', columnGap: '8px', alignItems: 'center' }}
					>
						<TextField id="deck-id" label="Enter deck id" variant="outlined" onChange={(e) => setTextInputValue(e.target.value)} required/>
						<Button onClick={getDeck} variant="contained"> Get deck </Button>
					</Box>
					<p>{fetchError ? "Couldn't find a deck with given search input!" : ""}</p>
					{deck && <DeckView deck={deck} />}
				</Box>
			</Box>
		</div>
	);
}

export default App;
