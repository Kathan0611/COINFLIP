import { ConfigRequestBody, MemoryGameAttributes } from 'memory-game';
import { deleteFile, getImages } from '../../../helpers/memory-game/uploadHelper';
import MemoryGame from '../../../models/memory-game/memoryGameModel';

// Find one memory game config
export const findMemoryGameConfig = async (): Promise<MemoryGameAttributes | null> => {
  const configFound = await MemoryGame.findOne();
  return configFound ? configFound.toJSON() : null;
};

// Delete updated old image files from the existing config.
const deleteUpdatedOldImages = async (
  oldConfig: MemoryGameAttributes,
  newConfig: Partial<MemoryGameAttributes>,
): Promise<void> => {
  const deletionPromises: Promise<void>[] = [];

  // Deletes old image files if they are present in the new config.
  if (newConfig.background_image === null && oldConfig.background_image) {
    deletionPromises.push(deleteFile(oldConfig.background_image));
  }
  if (newConfig.background_image && oldConfig.background_image) {
    deletionPromises.push(deleteFile(oldConfig.background_image));
  }
  if (newConfig.card_cover_image && oldConfig.card_cover_image) {
    deletionPromises.push(deleteFile(oldConfig.card_cover_image));
  }
  if (newConfig.card_front_images && oldConfig.card_front_images && Array.isArray(oldConfig.card_front_images)) {
    for (const imagePath of oldConfig.card_front_images) {
      deletionPromises.push(deleteFile(imagePath));
    }
  }

  // Wait for all deletions to complete concurrently.
  await Promise.all(deletionPromises);
};

// Get memory game config
export const getMemoryGameConfig = async () => {
  const config = await findMemoryGameConfig();
  if (!config) return { error: 'GAME_CONFIG_NOT_FOUND' };
  return config;
};

// Create or update a memory game config
export const createOrUpdateConfig = async (body: ConfigRequestBody, files: any) => {
  const { game_time, total_cards, rewards, daily_limit, isBackgroundImageRemoved, game_theme } = body;
  const { background_image, card_cover_image, card_front_images } = getImages(files);

  // Prepare the new config.
  const configData: Partial<MemoryGameAttributes> = {
    game_time: parseInt(game_time, 10),
    total_cards: parseInt(total_cards, 10),
    daily_limit: parseInt(daily_limit, 10),
    rewards: JSON.parse(rewards),
    game_theme: game_theme ? JSON.parse(game_theme) : null,
    background_image: isBackgroundImageRemoved === 'true' ? null : background_image,
    card_cover_image: card_cover_image,
    card_front_images: card_front_images,
  };

  let existingConfig = await findMemoryGameConfig();

  // If the config already exists, update it.
  if (existingConfig) {
    await deleteUpdatedOldImages(existingConfig, configData); // Delete the updated old images if they exist
    await MemoryGame.update(configData, { where: {} }); // Update existing config
    existingConfig = await findMemoryGameConfig(); // Retrieve updated config
  } else {
    // Create new config
    existingConfig = await MemoryGame.create(configData as MemoryGameAttributes);
  }

  return existingConfig;
};
