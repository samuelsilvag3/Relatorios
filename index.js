import {Builder, Browser, By, Key, until, WebElement} from "selenium-webdriver"
import fs from 'fs'
import Login from './Login.js'
import ConfiguraRel from './ConfiguraRel.js'

async function relatorios(){
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    let login = new Login()
    let config = new ConfiguraRel()
    
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

      let numRel = []
      //Armazena numero do relatorio gerado
      let fila = await driver.findElements(By.tagName('tr'))
      for(let linha = 2; linha < fila.length; linha ++){
        let XpSequencia = `//*[@id="tblsr"]/tbody/tr[${linha}]/td[1]/div`
        let XpRelatorio = `//*[@id="tblsr"]/tbody/tr[${linha}]/td[2]/div`
        let XpUsuario = `//*[@id="tblsr"]/tbody/tr[${linha}]/td[4]/div`

        let Sequencia = await fila[linha].findElement(By.xpath(XpSequencia)).getText()
        let Relatorio = (await fila[linha].findElement(By.xpath(XpRelatorio)).getText()).slice(0, 3)
        let usuario = await fila[linha].findElement(By.xpath(XpUsuario)).getText()
        if(Relatorio === '455' && usuario === 'dsparcei'){
          numRel.push(Sequencia)
        }
      }

      console.log(numRel[0])

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
              await driver.manage().setTimeouts({implicit: 30000})
            }
          }
        }
        let atualizar = await driver.findElement(By.xpath('//*[@id="2"]'))
        await driver.manage().setTimeouts({implicit: 30000})
        atualizar.click()
        await driver.sleep(5000)
      }
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