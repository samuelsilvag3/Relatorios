import {By, until} from 'selenium-webdriver'

export class Fila {
    async FilaProcessamento(driver){
        try{
            let numRel = []
            //Armazena numero do relatorio gerado
            let fila = await driver.findElements(By.tagName('tr'))
            for ( let linha = 2; linha < fila.length; linha ++ ){
                let XpSequencia = `//*[@id="tblsr"]/tbody/tr[${linha}]/td[1]/div`
                let XpRelatorio = `//*[@id="tblsr"]/tbody/tr[${linha}]/td[2]/div`
                let XpUsuario = `//*[@id="tblsr"]/tbody/tr[${linha}]/td[4]/div`

                let Sequencia = await fila[linha].findElement(By.xpath(XpSequencia)).getText()
                let Relatorio = (await fila[linha].findElement(By.xpath(XpRelatorio)).getText()).slice(0, 3)
                let usuario = await fila[linha].findElement(By.xpath(XpUsuario)).getText()
                if(Relatorio === '455' && usuario === 'powerbi'){
                    numRel.push(Sequencia)
                }
            }

            //Verifica status de processamento do relatorio
            let status = ''
            //Laco para atualizar pagina ate o Relatorio estar disponivel para Download
            while(status !== 'Baixar'){
                fila = await driver.findElements(By.tagName('tr'))
                //Localiza Relatorio gerado na fila de relatorios
                for(let linha=2; linha < fila.length; linha ++){
                    let seq = await fila[linha].findElement(By.xpath(`//*[@id="tblsr"]/tbody/tr[${linha}]/td[1]/div`)).getText()
                    if(seq === numRel[0]){
                        status = await fila[linha].findElement(By.xpath(`//*[@id="tblsr"]/tbody/tr[${linha}]/td[9]/div/a/u`)).getText()
                        if(status==='Baixar'){
                        //Realiza Download do Relatorio
                        await driver.findElement(By.xpath(`//*[@id="tblsr"]/tbody/tr[${linha}]/td[9]/div/a/u`)).click()
                        await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath('//*[@id="procimg"]'))), 30000)
                        await driver.wait(until.elementIsNotVisible(await driver.findElement(By.xpath('//*[@id="procimg"]'))), 30000)
                        }
                    }
                }
                let atualizar = await driver.findElement(By.xpath('//*[@id="2"]'))
                await driver.manage().setTimeouts({implicit: 30000})
                atualizar.click()
                await driver.sleep(7000)
            }
        }
        catch(err){
            console.log('Erro')
            console.log(err)
        }
    }
}

export default Fila