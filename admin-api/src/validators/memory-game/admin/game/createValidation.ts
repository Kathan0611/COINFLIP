import { body } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

const MAX_CARDS = process.env.MEMORY_GAME_MAX_CARDS || '24';

// Custom validation function for rewards JSON.
const validateRewardsJSON = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    const requiredKeys = ['grandmaster', 'expert', 'skilled', 'beginner', 'novice', 'better_luck_next_time'];
    for (const key of requiredKeys) {
      if (typeof parsed[key] !== 'string') {
        throw new Error();
      }
    }
    return true;
  } catch (err) {
    throw new Error(
      'Rewards must be a valid JSON object with keys: grandmaster, expert, skilled, beginner, novice, better_luck_next_time.',
    );
  }
};

const validateGameThemeJSON = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    const requiredKeys = ['text_color', 'button_text_color', 'button_background_color'];
    for (const key of requiredKeys) {
      if (typeof parsed[key] !== 'string') {
        throw new Error();
      }
    }
    return true;
  } catch (err) {
    throw new Error(
      'game_theme must be a valid JSON object with keys: text_color, button_text_color, button_background_color.',
    );
  }
};

export const createValidation = [
  // Validate game_time: must not be empty and must be a positive integer.
  body('game_time')
    .notEmpty()
    .withMessage('Game time cannot be empty.')
    .isInt({ gt: 0 })
    .withMessage('Game time must be a positive integer.'),

  // Validate total_cards: must not be empty, must be a positive integer, and a multiple of 2.
  body('total_cards')
    .notEmpty()
    .withMessage('Total cards cannot be empty.')
    .isInt()
    .withMessage('Total cards must be a positive integer.')
    .custom(value => {
      const intVal = parseInt(value, 10);
      if (intVal < 2 || intVal > parseInt(MAX_CARDS, 10)) {
        throw new Error(`Total cards must be between 2 to ${MAX_CARDS}.`);
      }
      if (intVal % 2 !== 0) {
        throw new Error('Total cards must be a multiple of 2.');
      }
      return true;
    }),

  body('daily_limit')
    .notEmpty()
    .withMessage('Daily limit can not be empty')
    .isInt({ min: 0 })
    .withMessage('Daily limit must be a positive integer.'),

  // Validate rewards: must not be empty and must be a valid JSON object with the expected reward keys.
  body('rewards').notEmpty().withMessage('Rewards cannot be empty.').custom(validateRewardsJSON),

  // Validate game_theme: optional , but if provided, must be a valid game theme.
  body('game_theme').optional().custom(validateGameThemeJSON),
];
