import {Builder, Browser, By, Key, until, WebElement} from "selenium-webdriver"
import fs from 'fs'
import Login from './Login.js'
import ConfiguraRel from './ConfiguraRel.js'
import Fila from './FIla.js'

async function relatorios(){
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    let login = new Login()
    let config = new ConfiguraRel()
    let FilaRel = new Fila()
    
    try{
      //Realiza Login no SSW
      await driver.get('https://sistema.ssw.inf.br/bin/ssw0422')
      const JanelaInicial = await driver.getWindowHandle()
      await login.LoginSSW(driver)

      //Acessar gerador de relatorios de CTE emitidos
      let opcao = await driver.findElement(By.xpath('//*[@id="3"]'))
      opcao.sendKeys('455')
      await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 2000)

      //Laço 02 meses
      //Troca para nova janela aberta
      let janelas = await driver.getAllWindowHandles()
      janelas.forEach(async handle => {
        if(handle !== JanelaInicial){
          await driver.switchTo().window(handle)
        }
      })

      //Configura Filtros do Relatorio
      await driver.wait(until.titleIs('455 - Fretes Expedidos/Recebidos - CTRCs :: SSW Sistema de Transportes'), 30000);
      let jan455 = await driver.getWindowHandle()
      await config.GeraRel(driver)

      //Acessa fila de espera
      await driver.switchTo().window(JanelaInicial)
      await driver.wait(until.titleIs('Menu Principal :: SSW Sistema de Transportes'), 30000)
      opcao.sendKeys('156')
      
      await driver.wait(async () => (await driver.getAllWindowHandles()).length === 3, 2000)
      janelas = await driver.getAllWindowHandles()
      janelas.forEach(async handle => {
        if((handle !== JanelaInicial) && (handle !== jan455)){
          await driver.switchTo().window(handle)
        }
      })
      await driver.wait(until.titleIs('156 - Fila de processamento em lotes :: SSW Sistema de Transportes'), 30000)
      await FilaRel.FilaProcessamento(driver)
    }
    catch(err){
        console.log('erro')
        console.log(err)
      }
      finally{
        console.log('Finally!!!')
        await driver.quit()
      }
}

relatorios()