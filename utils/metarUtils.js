// utils/metarUtils.js

/**
 * Traduit les abréviations de couverture nuageuse.
 * @param {string} abbreviation - L'abréviation de la couverture nuageuse.
 * @return {string} La description de la couverture nuageuse.
 */
function translateCloudCover(abbreviation) {
    const translations = {
        "SKC": "d'un ciel dégagé",
        "CLR": "d'un ciel clair",
        "FEW": "de quelques nuages de 1 à 2 octas",
        "SCT": "de nuages épars de 3 à 4 octas",
        "BKN": "de nuages fragmentés de 5 à 7 octas",
        "OVC": "d'un Ciel couvert (8 octas)",
        "VV": "d'un ciel invisible en dessous de la base des nuages",
        "CB": "de cumulonimbus",
        "TCU": "de cumulus congestus",
        "CAVOK": "d'un ciel et visibilité clairs",
        "NSW": "sans précipitations importantes, pas de temps significatif",
        "FG": "de brouillard",
        "BR": "de brume",
        "HZ": "de brume sèche",
        "FU": "de fumée",
        "DU": "de poussière",
        "SA": "de sable",
        "VA": "de cendres volcaniques",
        "SQ": "de ligne de grains",
        "FC": "de tornade en formation",
        "TS": "d'orages",
        "SH": "d'averses",
        "DZ": "de bruine",
        "RA": "de pluie",
        "SN": "de neige",
        "SG": "de grésil",
        "IC": "de grésil en suspension",
        "PL": "de pluie verglaçante",
        "GR": "de grêle",
        "UP": "inconnues",
        "NSC": "sans nuages",
    };
    return translations[abbreviation] || 'Unknown';
}


/**
 * Obtient le suffixe ordinal correct en français pour un nombre donné.
 * @param {number} number - Le nombre pour lequel obtenir le suffixe ordinal.
 * @return {string} Le suffixe ordinal correct.
 */
function getOrdinalSuffix(number) {
    if (number === 1) {
        return '1er';
    } else {
        return `${number}ème`;
    }
}



module.exports = { translateCloudCover, getOrdinalSuffix };
