export const formStyles = {
  fieldset: 'relative w-full mb-4',
  textInput:
    'peer w-full border-b-2 pt-4 pb-2 border-primary-100 text-black transition focus:border-blue-600 focus:outline-none placeholder-shown:border-blue-600 z-0',
  label:
    'absolute left-0 transform cursor-text leading-7 top-1/2 -translate-y-1/2 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2',
};

export const layoutStyles = {
  container: 'relative mx-auto px-[14px] w-[1428px] max-w-full',
  row: '-mx-[14px] flex flex-wrap -mr-[0.75rem] -ml-[0.75rem]',
};
export const formCreateCourseStyles = {
  input:
    'flex h-9 w-full rounded-md border border-input bg-primary-50 px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  label: 'transition-all text-[15px] text-black font-medium',
};
