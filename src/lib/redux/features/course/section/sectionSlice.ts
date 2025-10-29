import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Section, SectionDetail } from './sectionApi';

interface SectionState {
    sections: Section[];
    currentSection: SectionDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: SectionState = {
    sections: [],
    currentSection: null,
    loading: false,
    error: null,
};

const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {
        setSections: (state, action: PayloadAction<Section[]>) => {
            state.sections = action.payload;
        },
        setCurrentSection: (state, action: PayloadAction<SectionDetail | null>) => {
            state.currentSection = action.payload;
        },
        setSectionLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSectionError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setSections,
    setCurrentSection,
    setSectionLoading,
    setSectionError,
} = sectionSlice.actions;

export default sectionSlice.reducer;
