import { useState, useEffect } from "react";
import { SimpleCard as CardType } from "../types/game";
import { CardDisplay } from "./CardDisplay";
import { TEAM_COST_LIMITS } from "../utils/constants";

interface TeamBuilderProps {
  availableCards: CardType[];
  onTeamSelected: (cardIds: bigint[]) => void;
  maxTeamSize?: number;
  costLimit?: number;
  disabled?: boolean;
}

export function TeamBuilder({
  availableCards,
  onTeamSelected,
  maxTeamSize = 3,
  costLimit = TEAM_COST_LIMITS.EarlyGame,
  disabled = false
}: TeamBuilderProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<Set<bigint>>(new Set());
  const [teamCost, setTeamCost] = useState(0);

  // Recalculate team cost when selection changes
  useEffect(() => {
    let totalCost = 0;

    for (const cardId of selectedCardIds) {
      const card = availableCards.find(c => c.id === cardId);
      if (card) {
        const baseCost = getCardCost(card.rarity);
        const levelBonus = Number(card.level) / 2;
        totalCost += baseCost + levelBonus;
      }
    }

    setTeamCost(totalCost);
  }, [selectedCardIds, availableCards]);

  const handleCardToggle = (cardId: bigint) => {
    if (disabled) return;

    const newSelection = new Set(selectedCardIds);

    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else {
      // Check if we can add more cards
      if (newSelection.size >= maxTeamSize) {
        alert(`Team size limit (${maxTeamSize}) reached`);
        return;
      }

      newSelection.add(cardId);
    }

    setSelectedCardIds(newSelection);
  };

  const canSubmit =
    selectedCardIds.size >= 1 &&
    selectedCardIds.size <= maxTeamSize &&
    teamCost <= costLimit &&
    !disabled;

  const handleSubmit = () => {
    if (canSubmit) {
      onTeamSelected(Array.from(selectedCardIds));
    }
  };

  const costPercentage = (teamCost / costLimit) * 100;
  const costStatus = teamCost > costLimit ? "text-red-400" : "text-green-400";

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Build Your Team</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">
              Cards selected: <span className="font-bold text-white">{selectedCardIds.size}</span>/{maxTeamSize}
            </p>
            <p className={`text-sm ${costStatus}`}>
              Team cost: <span className="font-bold">{Math.round(teamCost * 10) / 10}</span>/{costLimit}
            </p>
          </div>

          {/* Cost bar */}
          <div className="w-40">
            <div className="w-full bg-gray-800 rounded h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  teamCost > costLimit ? "bg-red-600" : "bg-green-600"
                }`}
                style={{ width: `${Math.min(costPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card selection grid */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Available Cards</p>
        {availableCards.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No cards available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {availableCards.map(card => (
              <div
                key={Number(card.id)}
                onClick={() => handleCardToggle(card.id)}
                className="cursor-pointer"
              >
                <CardDisplay
                  card={card}
                  compact
                  selectable
                  isSelected={selectedCardIds.has(card.id)}
                  onSelect={handleCardToggle}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected team preview */}
      {selectedCardIds.size > 0 && (
        <div className="mb-4 bg-gray-800 rounded p-3">
          <p className="text-xs text-gray-400 mb-2">Current Team</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedCardIds).map(cardId => {
              const card = availableCards.find(c => c.id === cardId);
              return card ? (
                <div
                  key={Number(cardId)}
                  className="bg-green-900 text-green-100 px-3 py-1 rounded text-sm flex items-center justify-between gap-2"
                >
                  <span>{card.name}</span>
                  <button
                    onClick={() => handleCardToggle(cardId)}
                    className="text-green-300 hover:text-green-100 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Validation messages */}
      {selectedCardIds.size > 0 && (
        <div className="mb-3 text-xs space-y-1">
          {selectedCardIds.size === 0 && (
            <p className="text-yellow-400">✓ Select 1-{maxTeamSize} cards</p>
          )}
          {selectedCardIds.size > 0 && selectedCardIds.size <= maxTeamSize && (
            <p className="text-green-400">✓ Team size valid</p>
          )}
          {teamCost <= costLimit ? (
            <p className="text-green-400">✓ Team cost within limit</p>
          ) : (
            <p className="text-red-400">✗ Team cost exceeds limit by {Math.round((teamCost - costLimit) * 10) / 10}</p>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-2 px-4 rounded font-bold transition-all ${
          canSubmit
            ? "bg-green-600 hover:bg-green-500 text-white cursor-pointer"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        {selectedCardIds.size === 0 ? "Select Cards" : `Battle with ${selectedCardIds.size} Card${selectedCardIds.size > 1 ? "s" : ""}`}
      </button>
    </div>
  );
}

/**
 * Helper to get card cost by rarity
 */
function getCardCost(rarity: number): number {
  const costs = [1, 2, 3, 4, 5]; // Common, Uncommon, Rare, Epic, Legendary
  return costs[rarity] ?? 1;
}
