export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (["Escape", "Enter"].includes(event.key)) {
    event.currentTarget.blur();
  }
};
