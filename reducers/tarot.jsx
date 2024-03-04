import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    value: { games: [] },
};
export const userSlice = createSlice({
    name: 'tarot',
    initialState,
    reducers: {
        create: (state, action) => {
            state.value.games.push({
                firstPlayer: {
                    name: action.payload[0],
                    game: [],
                    preneur: [],

                },
                secondPlayer: {
                    name: action.payload[1],
                    game: [],
                    preneur: [],

                },
                thirdPlayer: {
                    name: action.payload[2],
                    game: [],
                    preneur: [],

                },
                forthPlayer: {
                    name: action.payload[3],
                    game: [],
                    preneur: [],

                },
                fifthPlayer: {
                    name: action.payload[4],
                    game: [],
                    preneur: [],

                },
            })
        },
        addGame: (state, action) => {
            const point = action.payload
            const gameIndex = state.value.games.findIndex((game, index) => index === point.index)

            if (gameIndex !== -1) {
                const game = state.value.games[gameIndex];
                game.firstPlayer.game.push(point.firstPlayer.points);
                game.secondPlayer.game.push(point.secondPlayer.points);
                game.thirdPlayer.game.push(point.thirdPlayer.points);
                game.forthPlayer.game.push(point.forthPlayer.points);
                game.fifthPlayer.game.push(point.fifthPlayer.points);

                game.firstPlayer.preneur.push(point.firstPlayer.isPreneur);
                game.secondPlayer.preneur.push(point.secondPlayer.isPreneur);
                game.thirdPlayer.preneur.push(point.thirdPlayer.isPreneur);
                game.forthPlayer.preneur.push(point.forthPlayer.isPreneur);
                game.fifthPlayer.preneur.push(point.fifthPlayer.isPreneur);


            }
        },
        // delete all games in a game
        deleteGame: (state, action) => {
            const indexToDelete = action.payload;

            if (indexToDelete >= 0 && indexToDelete < state.value.games.length) {
                state.value.games.splice(indexToDelete, 1);
            }
        },
        // delete a single game in a game
        deleteSingleGame: (state, action) => {
            const indexGameWheteToDelete = action.payload.indexGameWhereToDelete;
            const indexSingleGametoDelete = action.payload.indexGametoDelete

            if (indexGameWheteToDelete >= 0 && indexGameWheteToDelete < state.value.games.length) {

                state.value.games[indexGameWheteToDelete].firstPlayer.game.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].secondPlayer.game.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].thirdPlayer.game.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].forthPlayer.game.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].fifthPlayer.game.splice(indexSingleGametoDelete, 1);

                state.value.games[indexGameWheteToDelete].firstPlayer.preneur.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].secondPlayer.preneur.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].thirdPlayer.preneur.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].forthPlayer.preneur.splice(indexSingleGametoDelete, 1);
                state.value.games[indexGameWheteToDelete].fifthPlayer.preneur.splice(indexSingleGametoDelete, 1);
            }
        },

    },
});
export const { create, deleteGame, addGame, deleteSingleGame } = userSlice.actions;
export default userSlice.reducer;
