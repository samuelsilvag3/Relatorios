import {Builder, Browser, By, Key, until} from "selenium-webdriver"
import fs from 'fs'
import Login from './Login.js'
import ConfiguraRel from './ConfiguraRel.js'

async function relatorios(){
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    let login = new Login()
    let config = new ConfiguraRel()
    
    try{
      const JanelaInicial = await driver.getWindowHandle()
      await driver.get('https://sistema.ssw.inf.br/bin/ssw0422')
      await login.LoginSSW(driver)

      //Acessar gerador de relatorios de CTE emitidos
      let opcao = await driver.findElement(By.xpath('//*[@id="3"]'))
      opcao.sendKeys('455')
      await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 2000)

      //Troca para nova janela aberta
      let janelas = await driver.getAllWindowHandles()
      janelas.forEach(async handle => {
        if(handle !== JanelaInicial){
          await driver.switchTo().window(handle)
        }
      })
      await driver.wait(until.titleIs('455 - Fretes Expedidos/Recebidos - CTRCs :: SSW Sistema de Transportes'), 30000);
      
      await config.GeraRel(driver)
    }
    catch(err){
        console.log('erro')
        console.log(err)
      }
      finally{
        //await driver.quit()
        console.log('Finally!!!')
      }
}

relatorios()