# Asset Inventory

- Scan date: 2026-03-25
- Total referenced files under `/game-assets-v3/`: 52
- Orphaned files detected in `public/game-assets-v3`: 0
- Strategy applied: preserve current JPG/PNG sources, enable AVIF/WebP delivery via Next image optimization, tighten `sizes`/priority in UI, and avoid renaming any referenced asset path.

## Largest source files

| Asset | Size |
| --- | ---: |
| `/game-assets-v3/history/chapters/part-01-tratado-promessa.jpg` | 5,695,933 B |
| `/game-assets-v3/history/hero-history.jpg` | 4,815,751 B |
| `/game-assets-v3/hub/restoration/modules/estruturas-operacao.jpg` | 4,021,716 B |
| `/game-assets-v3/hub/restoration/modules/locomotiva-material-rodante.jpg` | 3,350,079 B |
| `/game-assets-v3/hub/restoration/modules/barracoes-galpoes.jpg` | 2,755,826 B |
| `/game-assets-v3/hub/restoration/modules/trilhos.jpg` | 2,300,768 B |
| `/game-assets-v3/quiz/modules/03-trabalho-saude-cotidiano.jpg` | 2,203,414 B |
| `/game-assets-v3/hub/restoration/hero-restoration-2026.jpg` | 1,862,805 B |
| `/game-assets-v3/quiz/modules/02-construcao-engenharia.jpg` | 1,798,699 B |
| `/game-assets-v3/quiz/modules/01-diplomacia-territorio.jpg` | 1,458,774 B |

## Budgets by category

- Hero principal: preferir entrega otimizada <= 350 KB no device real.
- Cards do hub: preferir <= 180 KB por card no breakpoint mobile.
- Thumbnails do museu/perfis: preferir <= 90 KB por imagem.
- Imagens de capítulo/módulo: preferir <= 250 KB por viewport mobile.

## Notes

- O inventário atual não indica resíduos órfãos em `public/game-assets-v3`.
- Os maiores riscos continuam concentrados nos heroes históricos e nos módulos de restauração.
- Próximo passo opcional fora desta implementação: gerar derivados dedicados por breakpoint para os 10 maiores arquivos.
