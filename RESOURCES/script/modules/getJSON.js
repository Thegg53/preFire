export async function getJSON(path){
  try {
    const  response =   await fetch(`RESOURCES/data/${path}.json`);
    if   (!response.ok) throw new Error(`Response status: ${response.status}`);
    const  cardData =   await response.json();
    return cardData;
  } catch (error) { console.error(error.message); }
}
