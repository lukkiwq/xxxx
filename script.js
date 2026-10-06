const TOKEN = "dcd385790e136e2889709f0fd41c17ee8cca47762c08383b2ea3b73707edcd61";

let input = document.getElementById("url");
const btn = document.getElementById("download");
const btnClear = document.getElementById("clear");
const statusEl = document.getElementById("status");
const btnCopy = document.getElementById("clipboard");

btnCopy.addEventListener("click", async () => {
  try {
    const texto = await navigator.clipboard.readText();
    input.value = texto;
  } catch (erro) {
    console.error("Não foi possível ler a área de transferência:", erro);
  }
});

btn.onclick = async () => {

    const url = document.getElementById("url").value.trim();

    const url_formatada = url.match(/https?:\/\/[^\s]+/)?.[0];

    if(!url_formatada){
        statusEl.textContent = "Informe um link.";
        return;
    }

    btn.disabled = true;
    statusEl.textContent = "Buscando vídeo...";

    try{

        const hash = btoa(url_formatada) + "1029YWlvLWRs";

        const body = new URLSearchParams({
            url: url_formatada,
            token:TOKEN,
            hash
        });

        const response = await fetch(
            "https://vidburner.com/wp-json/aio-dl/video-data/",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                body
            }
        );

        const data = await response.json();

        if(!data.medias || !data.medias.length){
            throw new Error();
        }

        const a = document.createElement("a");
        a.href = data.medias[0].url;
        a.download = "video.mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();

        statusEl.textContent = "Download iniciado!";

    }catch{

        statusEl.textContent = "Erro ao baixar o vídeo.";

    }
    url.value = ""
    btn.disabled = false;

}

btnClear.addEventListener("click", () => url.value = "")