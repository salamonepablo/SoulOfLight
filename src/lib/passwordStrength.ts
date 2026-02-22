export interface PasswordStrengthResult {
  score: number;
  label: "Muy debil" | "Debil" | "Media" | "Fuerte";
}

function clampScore(score: number): number {
  if (score < 0) {
    return 0;
  }

  if (score > 4) {
    return 4;
  }

  return score;
}

function getLabel(score: number): PasswordStrengthResult["label"] {
  if (score <= 0) {
    return "Muy debil";
  }

  if (score === 1 || score === 2) {
    return "Debil";
  }

  if (score === 3) {
    return "Media";
  }

  return "Fuerte";
}

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, label: "Muy debil" };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) {
    score += 1;
  }

  const clampedScore = clampScore(score);

  return {
    score: clampedScore,
    label: getLabel(clampedScore),
  };
}
