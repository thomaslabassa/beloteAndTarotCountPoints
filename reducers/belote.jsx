import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    value: { games: [] },
};
export const userSlice = createSlice({
    name: 'belote',
    initialState,
    reducers: {
        create: (state, action) => {
            state.value.games.push({
                firstTeam: {
                    name: action.payload[0],
                    points: [0]
                },
                secondTeam: {
                    name: action.payload[1],
                    points: [0]
                },

            })
        },
        addGame: (state, action) => {
            const point = action.payload
            const gameIndex = state.value.games.findIndex((game, index) => index === point.index)

            if (gameIndex !== -1) {
                const game = state.value.games[gameIndex];
                game.firstTeam.points.push(point.firstTeam.points);
                game.secondTeam.points.push(point.secondTeam.points);


            }
        },
        // delete all games in a game
        deleteGame: (state, action) => {
            const indexToDelete = action.payload;

            if (indexToDelete >= 0 && indexToDelete < state.value.games.length) {
                state.value.games.splice(indexToDelete, 1);
            }
        },

    },
});
export const { create, deleteGame, addGame } = userSlice.actions;
export default userSlice.reducer;
