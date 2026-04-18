// Error handling utilities
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages: Record<string, string> = {
  // Network errors
  NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre connexion.',
  TIMEOUT: 'La requête a expiré. Veuillez réessayer.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',

  // Auth errors
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
  USER_NOT_FOUND: 'Utilisateur non trouvé.',
  EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé.',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à accéder à cette ressource.',
  TOKEN_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.',

  // Product errors
  PRODUCT_NOT_FOUND: 'Produit introuvable.',
  OUT_OF_STOCK: 'Ce produit n\'est plus en stock.',
  INVALID_QUANTITY: 'La quantité n\'est pas valide.',

  // Order errors
  ORDER_NOT_FOUND: 'Commande introuvable.',
  INVALID_ORDER: 'Les données de commande ne sont pas valides.',
  PAYMENT_FAILED: 'Le paiement a échoué. Veuillez réessayer.',

  // Validation errors
  INVALID_EMAIL: 'Email invalide.',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 6 caractères.',
  REQUIRED_FIELD: 'Ce champ est obligatoire.',
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return errorMessages[error.code] || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return errorMessages[error] || error;
  }

  return errorMessages['SERVER_ERROR'];
};

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError) {
    return new AppError('NETWORK_ERROR', errorMessages['NETWORK_ERROR']);
  }

  return new AppError('SERVER_ERROR', errorMessages['SERVER_ERROR']);
};
