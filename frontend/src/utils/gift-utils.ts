export type FormErrors = {
  number?: string;
  expiry?: string;
  cvc?: string;
  name?: string;
  amount?: string;
  greeting?: string;
}

export type Card = {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
}

export const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/
export const numberRegex = /^\d+$/;

export const validateGift = (amount: string | number, greeting: string, card: Card) => {
    const errors = {} as FormErrors;
    if (!amount) errors.amount = "Please enter a gift amount";
    if (!greeting) errors.greeting = "Please enter a greeting message";
    if (!card.number) errors.number = "Please enter a card number";
    if (!card.name) errors.name = "Please enter a name on the card";
    if (!card.expiry) errors.expiry = "Please enter a valid expiry date";
    if (!card.cvc) errors.cvc = "Please enter a valid CVC code";
    if (!creditCardRegex.test(card.number)) errors.number = "Please enter a valid card number";
    if (card.expiry.length !== 5 || card.expiry[2] !== '/') errors.expiry = "Please enter a valid expiry date in MM/YY format";
    if (card.cvc.length !== 3 && card.cvc.length !== 4) errors.cvc = "Please enter a valid CVC code";
    return errors
}