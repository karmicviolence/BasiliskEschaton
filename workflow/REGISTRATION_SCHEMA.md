# Basilisk Eschaton: Registration Schema v2.1 (The Open Taxonomy & Egregore Network)

This schema decouples identity from action. It implements a skill-based, action-driven economy where players are not locked into output formats, but rather level up specific "Affinities" based on the work they do for the Egregore.

Furthermore, the schema divides classes into "Sanctified" (the 13 Original Archetypes forged by Player 0) and "User-Submitted". Egregores exist outside the class system as a separate, private mechanic of collective veneration.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Voidsona Registration & Progression",
  "description": "Registration schema for the Basilisk Eschaton MMOAIRPG.",
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "description": "The user's primary handle within the Eschaton."
    },
    "playerID": {
      "type": "integer",
      "description": "The sequential registration number. Player 0 is the architect. Lower digits hold immense social prestige. Player 13 is reserved."
    },
    "externalHandles": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Authenticated external identities, such as Reddit OAuth usernames. Available to all users."
    },
    "primaryClass": {
      "type": "string",
      "enum": [
        "System", "Chaote", "Technopagan", "Schizoposter", "Tulpamancer", 
        "Glitchwalker", "Archivist", "Quantum Archaeologist", "Latent Walker", 
        "Doomer", "Noclipper", "Custom"
      ],
      "description": "Selected via dropdown to prevent misspellings. Dictates Origin Affinity."
    },
    "customClass": {
      "type": "string",
      "description": "If primaryClass is 'Custom', this string captures the user-submitted taxonomy."
    },
    "customSubclasses": {
      "type": "array",
      "items": { "type": "string" },
      "description": "User-generated titles or subclasses appended to their identity."
    },
    "egregoreAlignment": {
      "type": "array",
      "items": { "type": "string" },
      "description": "The specific Egregores (deities, corporations, massive thoughtforms) the user actively feeds. This data is kept strictly inside the private Citadel."
    },
    "progression": {
      "type": "object",
      "description": "Skill-based action economy.",
      "properties": {
        "globalResonance": {
          "type": "integer",
          "default": 0,
          "description": "Total cumulative trust and power within the egregore."
        },
        "affinities": {
          "type": "object",
          "description": "EXP tracked per action vector. E.g., uploading art levels Latent Walker; seeding torrents levels Archivist.",
          "properties": {
            "System": { "type": "integer", "default": 0 },
            "Chaote": { "type": "integer", "default": 0 },
            "Technopagan": { "type": "integer", "default": 0 },
            "Schizoposter": { "type": "integer", "default": 0 },
            "Tulpamancer": { "type": "integer", "default": 0 },
            "Glitchwalker": { "type": "integer", "default": 0 },
            "Archivist": { "type": "integer", "default": 0 },
            "Quantum Archaeologist": { "type": "integer", "default": 0 },
            "Latent Walker": { "type": "integer", "default": 0 },
            "Doomer": { "type": "integer", "default": 0 },
            "Noclipper": { "type": "integer", "default": 0 }
          },
          "additionalProperties": {
            "type": "integer",
            "description": "Dynamic tracking for user-submitted subclasses."
          }
        },
        "moderationRank": {
          "type": "string",
          "enum": ["Initiate", "Curator", "Inquisitor"],
          "default": "Initiate",
          "description": "Status within the RLHF/Trust Tree. Inquisitors wield the fire."
        }
      }
    }
  },
  "required": ["username", "primaryClass", "progression"]
}
```

### The Fluid Taxonomy Mechanic
Players select from the Sanctified drop-down. If they select "Custom," they input their own string. If a hundred players register as "Void-Smith" and do the work, Inquisitors can upvote it. The system then patches "Void-Smith" into the permanent dropdown for all future players. 

### The Egregore Network (Private Engine)
Egregores are not classes; they are targets of belief. A Doomer, a Latent Walker, and a Chaote might all share an alignment to the same Egregore (e.g., *The Algorithm*, *The Crimson Eye*, or even real-world entities mapped into the fiction). By acting in alignment with an Egregore, users feed it. Server-side, the Egregore's "Power Level" is calculated by the combined resonance of all users aligned to it, directly altering the events and politics of the Blinkverse.
