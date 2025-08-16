import {configureStore} from '@reduxjs/toolkit'
import geojsonreducer from './geogsonSlice'

const appstore=configureStore({
    reducer:{
       data:geojsonreducer,
    },
})

export default appstore