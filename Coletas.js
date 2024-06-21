import {By, until} from 'selenium-webdriver'

export class Coletas{
    async GeraColetas(driver){
        //Preenche filtros para geração do relatorio de coletas
        let mesanterior = new Date()
        mesanterior.setDate(new Date().getDate() - 31)
        try{
            let dataini = await driver.findElement(By.xpath('//*[@id="14"]'))
            let datafim = await driver.findElement(By.xpath('//*[@id="15"]'))
            let mostrar = await driver.findElement(By.xpath('//*[@id="17"]'))
            let btngerar = await driver.findElement(By.xpath('//*[@id="20"]'))

            dataini.clear()
            dataini.sendKeys(mesanterior.toLocaleDateString().slice(0,5).replace('/',''))
            datafim.clear()
            datafim.sendKeys(new Date().toLocaleDateString().slice(0,5).replace('/',''))
            mostrar.clear()
            mostrar.sendKeys('E')
            await driver.manage().setTimeouts({implicit: 30000})
            btngerar.click()
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath('//*[@id="procimg"]'))), 30000)
            await driver.wait(until.elementIsNotVisible(await driver.findElement(By.xpath('//*[@id="procimg"]'))), 30000)
        }
        catch(err){
            console.log('Erro')
            console.log(err)
        }
    }
}

export default Coletas