# Конфигурация сервера (копия для истории)

Файлы здесь **не деплоятся** — `deploy.sh` заливает только `lovable/dist/` и
`backend/`. Это снимок того, что реально лежит на VDS, чтобы правки nginx не
жили только в голове и на сервере.

| Файл в репозитории | Путь на сервере |
|---|---|
| `nginx-withoutwater.conf` | `/etc/nginx/sites-available/withoutwater` |
| `nginx-snippet-bv-headers.conf` | `/etc/nginx/snippets/bv-headers.conf` |
| `nginx-snippet-bv-headers-html.conf` | `/etc/nginx/snippets/bv-headers-html.conf` |

Снято 13.08.2026. После правок на сервере обновлять копию:

```bash
ssh root@5.129.198.180 'cat /etc/nginx/sites-available/withoutwater' > infra/nginx-withoutwater.conf
```

## Ловушка nginx: add_header не наследуется

`add_header` со `server`-уровня **пропадает** в любом `location`, где объявлен
свой `add_header`. На этом сайте свой `Cache-Control` есть почти у всех
location — из-за этого три заголовка безопасности (HSTS, `nosniff`,
`SAMEORIGIN`) не доходили ни до одной HTML-страницы. Обнаружено 13.08.2026.

Поэтому общие заголовки вынесены в сниппеты и подключаются `include` в каждый
такой location отдельно. Добавляя новый location с `add_header`, не забудьте
`include snippets/bv-headers.conf;` (или `-html`, если это страница).

## Link-заголовки (RFC 8288)

HTML-страницы отдают `Link` с точками входа для агентов и краулеров: карта
сайта, частые вопросы, команда, политика и оферта. Правило одно — **в заголовке
перечисляем только существующие адреса**: битая ссылка там хуже, чем её
отсутствие. `api-catalog` и `service-doc` намеренно не объявляем, публичного
API у сайта нет.

Проверка:

```bash
curl -sI https://withoutwater.ru/ | grep -i '^link:'
```
