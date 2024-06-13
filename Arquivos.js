import {readdir, copyFile, rm} from 'fs'
import path from 'path'
import util from 'util'

export class Arquivos{

async copiaarquivos(dirorig, dirdest){

    const ReadDirPromisify = util.promisify(readdir)

    ReadDirPromisify('Destino').then(res => {
        let apagar = path.join('c:/Relatorios/Destino', res[0])
        rm(apagar, (err) => {
            if(err){
                console.log(err)
            }
        })
    })

    ReadDirPromisify('Downloads').then(res => {
      let origem = path.join(dirorig, res[0])
      let destino = path.join(dirdest, res[0])
      
      copyFile(origem, destino, (err) => {
        if(err){
          console.log(err)
        }
      })
    })
}

}

export default Arquivos