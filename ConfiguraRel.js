import {By, until} from 'selenium-webdriver'

export class ConfiguraRel{

    async GeraRel(driver){
        //Configura geração de relatorio
        let mesanterior = new Date()
        mesanterior.setDate(new Date().getDate() - 31)

        try{            
            let dataini = await driver.findElement(By.xpath('//*[@id="11"]'))
            let datafim = await driver.findElement(By.xpath('//*[@id="12"]'))
            let tipLiquidacao = await driver.findElement(By.xpath('//*[@id="21"]'))
            let excel = await driver.findElement(By.xpath('//*[@id="35"]'))
            let compl1 = await driver.findElement(By.xpath('//*[@id="37"]'))
            let compl2 = await driver.findElement(By.xpath('//*[@id="38"]'))
            let compl3 = await driver.findElement(By.xpath('//*[@id="39"]'))
            let gerar = await driver.findElement(By.xpath('//*[@id="40"]'))

            //configura campos
            dataini.clear()
            dataini.sendKeys(mesanterior.toLocaleDateString().slice(0,5).replace('/',''))
            datafim.clear()
            datafim.sendKeys(new Date().toLocaleDateString().slice(0,5).replace('/',''))
            tipLiquidacao.clear()
            tipLiquidacao.sendKeys('T')
            excel.clear()
            excel.sendKeys('E')
            compl1.clear()
            await compl1.sendKeys('D')
            await driver.manage().setTimeouts({implicit: 30000})
            compl2.sendKeys('E')
            compl3.sendKeys('G')
            await driver.manage().setTimeouts({implicit: 30000})
            gerar.click()
            await driver.manage().setTimeouts({implicit: 30000})
            await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath('//*[@id="errormsg"]'))),30000)
            let continua = await driver.findElement(By.xpath('//*[@id="0"]'))
            continua.click()
            await driver.manage().setTimeouts({implicit: 30000})
            
        }catch(err){
            console.log('Erro')
            console.log(err)
        }
    }
}

export default ConfiguraRel