import {createSlice} from '@reduxjs/toolkit'

const geojsonSlice= createSlice({
    name:"data",
    initialState:{
        addgeojson:null,
    },
    reducers:{
      addgeojson: (state, action) => {
            state.addgeojson = action.payload
        },
    }
})
export const { addgeojson } = geojsonSlice.actions
export default geojsonSlice.reducer