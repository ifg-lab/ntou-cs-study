begin;

create table public.study_student_ids (
  user_id uuid primary key references auth.users(id) on delete cascade,
  student_id text not null check (student_id ~ '^[0-9]{4}[0-9A-Z][0-9]{3,4}$')
);

alter table public.study_threads add column edited_at timestamptz, add column deleted_at timestamptz;
alter table public.study_replies add column edited_at timestamptz, add column deleted_at timestamptz,
  add column reply_to uuid references public.study_replies(id) on delete set null,
  add column quotes_thread boolean not null default false, add check (not quotes_thread or reply_to is null);

create table public.study_emoji_catalog (emoji text primary key);

-- Unicode Emoji 18.0, fully-qualified entries from emoji-test.txt. See assets/emoji/LICENSE.txt.
-- EMOJI_CATALOG
insert into public.study_emoji_catalog(emoji)
select regexp_split_to_table($emoji$😀|😃|😄|😁|😆|😅|🤣|😂|🙂|🙃|🫠|🫫|😉|😊|😇|🥰|😍|🤩|😘|😗|☺️|😚|😙|🥲|😋|😛|😜|🤪|😝|🤑|🤗|🤭
🫢|🫣|🤫|🤔|🫡|🤐|🤨|😐|😑|😶|🫥|😶‍🌫️|😏|😒|🙄|😬|😮‍💨|🤥|🫨|🙂‍↔️|🙂‍↕️|😌|😔|😪|🤤|😴|🫩|😷|🤒|🤕|🤢|🤮
🤧|🥵|🥶|🥴|😵|😵‍💫|🤯|🤠|🥳|🥸|😎|🤓|🧐|😕|🫤|😟|🙁|☹️|😮|😯|😲|😳|🫪|🥺|🥹|😦|😧|😨|😰|😥|😢|😭
😱|😖|😣|😞|😓|😩|😫|🥱|😤|😡|😠|🤬|😈|👿|💀|☠️|💩|🤡|👹|👺|👻|👽|👾|🤖|😺|😸|😹|😻|😼|😽|🙀|😿
😾|🙈|🙉|🙊|💌|💘|💝|💖|💗|💓|💞|💕|💟|❣️|💔|❤️‍🔥|❤️‍🩹|❤️|🩷|🧡|💛|💚|💙|🩵|💜|🤎|🖤|🩶|🤍|💋|💯|💢
🫯|💥|💫|💦|💨|🕳️|💬|👁️‍🗨️|🗨️|🗯️|💭|💤|👋|👋🏻|👋🏼|👋🏽|👋🏾|👋🏿|🤚|🤚🏻|🤚🏼|🤚🏽|🤚🏾|🤚🏿|🖐️|🖐🏻|🖐🏼|🖐🏽|🖐🏾|🖐🏿|✋|✋🏻
✋🏼|✋🏽|✋🏾|✋🏿|🖖|🖖🏻|🖖🏼|🖖🏽|🖖🏾|🖖🏿|🫱|🫱🏻|🫱🏼|🫱🏽|🫱🏾|🫱🏿|🫲|🫲🏻|🫲🏼|🫲🏽|🫲🏾|🫲🏿|🫳|🫳🏻|🫳🏼|🫳🏽|🫳🏾|🫳🏿|🫴|🫴🏻|🫴🏼|🫴🏽
🫴🏾|🫴🏿|🫷|🫷🏻|🫷🏼|🫷🏽|🫷🏾|🫷🏿|🫸|🫸🏻|🫸🏼|🫸🏽|🫸🏾|🫸🏿|👌|👌🏻|👌🏼|👌🏽|👌🏾|👌🏿|🤌|🤌🏻|🤌🏼|🤌🏽|🤌🏾|🤌🏿|🤏|🤏🏻|🤏🏼|🤏🏽|🤏🏾|🤏🏿
✌️|✌🏻|✌🏼|✌🏽|✌🏾|✌🏿|🤞|🤞🏻|🤞🏼|🤞🏽|🤞🏾|🤞🏿|🫰|🫰🏻|🫰🏼|🫰🏽|🫰🏾|🫰🏿|🤟|🤟🏻|🤟🏼|🤟🏽|🤟🏾|🤟🏿|🤘|🤘🏻|🤘🏼|🤘🏽|🤘🏾|🤘🏿|🤙|🤙🏻
🤙🏼|🤙🏽|🤙🏾|🤙🏿|👈|👈🏻|👈🏼|👈🏽|👈🏾|👈🏿|👉|👉🏻|👉🏼|👉🏽|👉🏾|👉🏿|👆|👆🏻|👆🏼|👆🏽|👆🏾|👆🏿|🖕|🖕🏻|🖕🏼|🖕🏽|🖕🏾|🖕🏿|👇|👇🏻|👇🏼|👇🏽
👇🏾|👇🏿|☝️|☝🏻|☝🏼|☝🏽|☝🏾|☝🏿|🫵|🫵🏻|🫵🏼|🫵🏽|🫵🏾|🫵🏿|👍|👍🏻|👍🏼|👍🏽|👍🏾|👍🏿|👎|👎🏻|👎🏼|👎🏽|👎🏾|👎🏿|🫹|🫹🏻|🫹🏼|🫹🏽|🫹🏾|🫹🏿
🫺|🫺🏻|🫺🏼|🫺🏽|🫺🏾|🫺🏿|✊|✊🏻|✊🏼|✊🏽|✊🏾|✊🏿|👊|👊🏻|👊🏼|👊🏽|👊🏾|👊🏿|🤛|🤛🏻|🤛🏼|🤛🏽|🤛🏾|🤛🏿|🤜|🤜🏻|🤜🏼|🤜🏽|🤜🏾|🤜🏿|👏|👏🏻
👏🏼|👏🏽|👏🏾|👏🏿|🙌|🙌🏻|🙌🏼|🙌🏽|🙌🏾|🙌🏿|🫶|🫶🏻|🫶🏼|🫶🏽|🫶🏾|🫶🏿|👐|👐🏻|👐🏼|👐🏽|👐🏾|👐🏿|🤲|🤲🏻|🤲🏼|🤲🏽|🤲🏾|🤲🏿|🤝|🤝🏻|🤝🏼|🤝🏽
🤝🏾|🤝🏿|🫱🏻‍🫲🏼|🫱🏻‍🫲🏽|🫱🏻‍🫲🏾|🫱🏻‍🫲🏿|🫱🏼‍🫲🏻|🫱🏼‍🫲🏽|🫱🏼‍🫲🏾|🫱🏼‍🫲🏿|🫱🏽‍🫲🏻|🫱🏽‍🫲🏼|🫱🏽‍🫲🏾|🫱🏽‍🫲🏿|🫱🏾‍🫲🏻|🫱🏾‍🫲🏼|🫱🏾‍🫲🏽|🫱🏾‍🫲🏿|🫱🏿‍🫲🏻|🫱🏿‍🫲🏼|🫱🏿‍🫲🏽|🫱🏿‍🫲🏾|🙏|🙏🏻|🙏🏼|🙏🏽|🙏🏾|🙏🏿|✍️|✍🏻|✍🏼|✍🏽
✍🏾|✍🏿|💅|💅🏻|💅🏼|💅🏽|💅🏾|💅🏿|🤳|🤳🏻|🤳🏼|🤳🏽|🤳🏾|🤳🏿|💪|💪🏻|💪🏼|💪🏽|💪🏾|💪🏿|🦾|🦿|🦵|🦵🏻|🦵🏼|🦵🏽|🦵🏾|🦵🏿|🦶|🦶🏻|🦶🏼|🦶🏽
🦶🏾|🦶🏿|👂|👂🏻|👂🏼|👂🏽|👂🏾|👂🏿|🦻|🦻🏻|🦻🏼|🦻🏽|🦻🏾|🦻🏿|👃|👃🏻|👃🏼|👃🏽|👃🏾|👃🏿|🧠|🫀|🫁|🦷|🦴|👀|👁️|👅|👄|🫦|👶|👶🏻
👶🏼|👶🏽|👶🏾|👶🏿|🧒|🧒🏻|🧒🏼|🧒🏽|🧒🏾|🧒🏿|👦|👦🏻|👦🏼|👦🏽|👦🏾|👦🏿|👧|👧🏻|👧🏼|👧🏽|👧🏾|👧🏿|🧑|🧑🏻|🧑🏼|🧑🏽|🧑🏾|🧑🏿|👱|👱🏻|👱🏼|👱🏽
👱🏾|👱🏿|👨|👨🏻|👨🏼|👨🏽|👨🏾|👨🏿|🧔|🧔🏻|🧔🏼|🧔🏽|🧔🏾|🧔🏿|🧔‍♂️|🧔🏻‍♂️|🧔🏼‍♂️|🧔🏽‍♂️|🧔🏾‍♂️|🧔🏿‍♂️|🧔‍♀️|🧔🏻‍♀️|🧔🏼‍♀️|🧔🏽‍♀️|🧔🏾‍♀️|🧔🏿‍♀️|👨‍🦰|👨🏻‍🦰|👨🏼‍🦰|👨🏽‍🦰|👨🏾‍🦰|👨🏿‍🦰
👨‍🦱|👨🏻‍🦱|👨🏼‍🦱|👨🏽‍🦱|👨🏾‍🦱|👨🏿‍🦱|👨‍🦳|👨🏻‍🦳|👨🏼‍🦳|👨🏽‍🦳|👨🏾‍🦳|👨🏿‍🦳|👨‍🦲|👨🏻‍🦲|👨🏼‍🦲|👨🏽‍🦲|👨🏾‍🦲|👨🏿‍🦲|👩|👩🏻|👩🏼|👩🏽|👩🏾|👩🏿|👩‍🦰|👩🏻‍🦰|👩🏼‍🦰|👩🏽‍🦰|👩🏾‍🦰|👩🏿‍🦰|🧑‍🦰|🧑🏻‍🦰
🧑🏼‍🦰|🧑🏽‍🦰|🧑🏾‍🦰|🧑🏿‍🦰|👩‍🦱|👩🏻‍🦱|👩🏼‍🦱|👩🏽‍🦱|👩🏾‍🦱|👩🏿‍🦱|🧑‍🦱|🧑🏻‍🦱|🧑🏼‍🦱|🧑🏽‍🦱|🧑🏾‍🦱|🧑🏿‍🦱|👩‍🦳|👩🏻‍🦳|👩🏼‍🦳|👩🏽‍🦳|👩🏾‍🦳|👩🏿‍🦳|🧑‍🦳|🧑🏻‍🦳|🧑🏼‍🦳|🧑🏽‍🦳|🧑🏾‍🦳|🧑🏿‍🦳|👩‍🦲|👩🏻‍🦲|👩🏼‍🦲|👩🏽‍🦲
👩🏾‍🦲|👩🏿‍🦲|🧑‍🦲|🧑🏻‍🦲|🧑🏼‍🦲|🧑🏽‍🦲|🧑🏾‍🦲|🧑🏿‍🦲|👱‍♀️|👱🏻‍♀️|👱🏼‍♀️|👱🏽‍♀️|👱🏾‍♀️|👱🏿‍♀️|👱‍♂️|👱🏻‍♂️|👱🏼‍♂️|👱🏽‍♂️|👱🏾‍♂️|👱🏿‍♂️|🧓|🧓🏻|🧓🏼|🧓🏽|🧓🏾|🧓🏿|👴|👴🏻|👴🏼|👴🏽|👴🏾|👴🏿
👵|👵🏻|👵🏼|👵🏽|👵🏾|👵🏿|🙍|🙍🏻|🙍🏼|🙍🏽|🙍🏾|🙍🏿|🙍‍♂️|🙍🏻‍♂️|🙍🏼‍♂️|🙍🏽‍♂️|🙍🏾‍♂️|🙍🏿‍♂️|🙍‍♀️|🙍🏻‍♀️|🙍🏼‍♀️|🙍🏽‍♀️|🙍🏾‍♀️|🙍🏿‍♀️|🙎|🙎🏻|🙎🏼|🙎🏽|🙎🏾|🙎🏿|🙎‍♂️|🙎🏻‍♂️
🙎🏼‍♂️|🙎🏽‍♂️|🙎🏾‍♂️|🙎🏿‍♂️|🙎‍♀️|🙎🏻‍♀️|🙎🏼‍♀️|🙎🏽‍♀️|🙎🏾‍♀️|🙎🏿‍♀️|🙅|🙅🏻|🙅🏼|🙅🏽|🙅🏾|🙅🏿|🙅‍♂️|🙅🏻‍♂️|🙅🏼‍♂️|🙅🏽‍♂️|🙅🏾‍♂️|🙅🏿‍♂️|🙅‍♀️|🙅🏻‍♀️|🙅🏼‍♀️|🙅🏽‍♀️|🙅🏾‍♀️|🙅🏿‍♀️|🙆|🙆🏻|🙆🏼|🙆🏽
🙆🏾|🙆🏿|🙆‍♂️|🙆🏻‍♂️|🙆🏼‍♂️|🙆🏽‍♂️|🙆🏾‍♂️|🙆🏿‍♂️|🙆‍♀️|🙆🏻‍♀️|🙆🏼‍♀️|🙆🏽‍♀️|🙆🏾‍♀️|🙆🏿‍♀️|💁|💁🏻|💁🏼|💁🏽|💁🏾|💁🏿|💁‍♂️|💁🏻‍♂️|💁🏼‍♂️|💁🏽‍♂️|💁🏾‍♂️|💁🏿‍♂️|💁‍♀️|💁🏻‍♀️|💁🏼‍♀️|💁🏽‍♀️|💁🏾‍♀️|💁🏿‍♀️
🙋|🙋🏻|🙋🏼|🙋🏽|🙋🏾|🙋🏿|🙋‍♂️|🙋🏻‍♂️|🙋🏼‍♂️|🙋🏽‍♂️|🙋🏾‍♂️|🙋🏿‍♂️|🙋‍♀️|🙋🏻‍♀️|🙋🏼‍♀️|🙋🏽‍♀️|🙋🏾‍♀️|🙋🏿‍♀️|🧏|🧏🏻|🧏🏼|🧏🏽|🧏🏾|🧏🏿|🧏‍♂️|🧏🏻‍♂️|🧏🏼‍♂️|🧏🏽‍♂️|🧏🏾‍♂️|🧏🏿‍♂️|🧏‍♀️|🧏🏻‍♀️
🧏🏼‍♀️|🧏🏽‍♀️|🧏🏾‍♀️|🧏🏿‍♀️|🙇|🙇🏻|🙇🏼|🙇🏽|🙇🏾|🙇🏿|🙇‍♂️|🙇🏻‍♂️|🙇🏼‍♂️|🙇🏽‍♂️|🙇🏾‍♂️|🙇🏿‍♂️|🙇‍♀️|🙇🏻‍♀️|🙇🏼‍♀️|🙇🏽‍♀️|🙇🏾‍♀️|🙇🏿‍♀️|🤦|🤦🏻|🤦🏼|🤦🏽|🤦🏾|🤦🏿|🤦‍♂️|🤦🏻‍♂️|🤦🏼‍♂️|🤦🏽‍♂️
🤦🏾‍♂️|🤦🏿‍♂️|🤦‍♀️|🤦🏻‍♀️|🤦🏼‍♀️|🤦🏽‍♀️|🤦🏾‍♀️|🤦🏿‍♀️|🤷|🤷🏻|🤷🏼|🤷🏽|🤷🏾|🤷🏿|🤷‍♂️|🤷🏻‍♂️|🤷🏼‍♂️|🤷🏽‍♂️|🤷🏾‍♂️|🤷🏿‍♂️|🤷‍♀️|🤷🏻‍♀️|🤷🏼‍♀️|🤷🏽‍♀️|🤷🏾‍♀️|🤷🏿‍♀️|🧑‍⚕️|🧑🏻‍⚕️|🧑🏼‍⚕️|🧑🏽‍⚕️|🧑🏾‍⚕️|🧑🏿‍⚕️
👨‍⚕️|👨🏻‍⚕️|👨🏼‍⚕️|👨🏽‍⚕️|👨🏾‍⚕️|👨🏿‍⚕️|👩‍⚕️|👩🏻‍⚕️|👩🏼‍⚕️|👩🏽‍⚕️|👩🏾‍⚕️|👩🏿‍⚕️|🧑‍🎓|🧑🏻‍🎓|🧑🏼‍🎓|🧑🏽‍🎓|🧑🏾‍🎓|🧑🏿‍🎓|👨‍🎓|👨🏻‍🎓|👨🏼‍🎓|👨🏽‍🎓|👨🏾‍🎓|👨🏿‍🎓|👩‍🎓|👩🏻‍🎓|👩🏼‍🎓|👩🏽‍🎓|👩🏾‍🎓|👩🏿‍🎓|🧑‍🏫|🧑🏻‍🏫
🧑🏼‍🏫|🧑🏽‍🏫|🧑🏾‍🏫|🧑🏿‍🏫|👨‍🏫|👨🏻‍🏫|👨🏼‍🏫|👨🏽‍🏫|👨🏾‍🏫|👨🏿‍🏫|👩‍🏫|👩🏻‍🏫|👩🏼‍🏫|👩🏽‍🏫|👩🏾‍🏫|👩🏿‍🏫|🧑‍⚖️|🧑🏻‍⚖️|🧑🏼‍⚖️|🧑🏽‍⚖️|🧑🏾‍⚖️|🧑🏿‍⚖️|👨‍⚖️|👨🏻‍⚖️|👨🏼‍⚖️|👨🏽‍⚖️|👨🏾‍⚖️|👨🏿‍⚖️|👩‍⚖️|👩🏻‍⚖️|👩🏼‍⚖️|👩🏽‍⚖️
👩🏾‍⚖️|👩🏿‍⚖️|🧑‍🌾|🧑🏻‍🌾|🧑🏼‍🌾|🧑🏽‍🌾|🧑🏾‍🌾|🧑🏿‍🌾|👨‍🌾|👨🏻‍🌾|👨🏼‍🌾|👨🏽‍🌾|👨🏾‍🌾|👨🏿‍🌾|👩‍🌾|👩🏻‍🌾|👩🏼‍🌾|👩🏽‍🌾|👩🏾‍🌾|👩🏿‍🌾|🧑‍🍳|🧑🏻‍🍳|🧑🏼‍🍳|🧑🏽‍🍳|🧑🏾‍🍳|🧑🏿‍🍳|👨‍🍳|👨🏻‍🍳|👨🏼‍🍳|👨🏽‍🍳|👨🏾‍🍳|👨🏿‍🍳
👩‍🍳|👩🏻‍🍳|👩🏼‍🍳|👩🏽‍🍳|👩🏾‍🍳|👩🏿‍🍳|🧑‍🔧|🧑🏻‍🔧|🧑🏼‍🔧|🧑🏽‍🔧|🧑🏾‍🔧|🧑🏿‍🔧|👨‍🔧|👨🏻‍🔧|👨🏼‍🔧|👨🏽‍🔧|👨🏾‍🔧|👨🏿‍🔧|👩‍🔧|👩🏻‍🔧|👩🏼‍🔧|👩🏽‍🔧|👩🏾‍🔧|👩🏿‍🔧|🧑‍🏭|🧑🏻‍🏭|🧑🏼‍🏭|🧑🏽‍🏭|🧑🏾‍🏭|🧑🏿‍🏭|👨‍🏭|👨🏻‍🏭
👨🏼‍🏭|👨🏽‍🏭|👨🏾‍🏭|👨🏿‍🏭|👩‍🏭|👩🏻‍🏭|👩🏼‍🏭|👩🏽‍🏭|👩🏾‍🏭|👩🏿‍🏭|🧑‍💼|🧑🏻‍💼|🧑🏼‍💼|🧑🏽‍💼|🧑🏾‍💼|🧑🏿‍💼|👨‍💼|👨🏻‍💼|👨🏼‍💼|👨🏽‍💼|👨🏾‍💼|👨🏿‍💼|👩‍💼|👩🏻‍💼|👩🏼‍💼|👩🏽‍💼|👩🏾‍💼|👩🏿‍💼|🧑‍🔬|🧑🏻‍🔬|🧑🏼‍🔬|🧑🏽‍🔬
🧑🏾‍🔬|🧑🏿‍🔬|👨‍🔬|👨🏻‍🔬|👨🏼‍🔬|👨🏽‍🔬|👨🏾‍🔬|👨🏿‍🔬|👩‍🔬|👩🏻‍🔬|👩🏼‍🔬|👩🏽‍🔬|👩🏾‍🔬|👩🏿‍🔬|🧑‍💻|🧑🏻‍💻|🧑🏼‍💻|🧑🏽‍💻|🧑🏾‍💻|🧑🏿‍💻|👨‍💻|👨🏻‍💻|👨🏼‍💻|👨🏽‍💻|👨🏾‍💻|👨🏿‍💻|👩‍💻|👩🏻‍💻|👩🏼‍💻|👩🏽‍💻|👩🏾‍💻|👩🏿‍💻
🧑‍🎤|🧑🏻‍🎤|🧑🏼‍🎤|🧑🏽‍🎤|🧑🏾‍🎤|🧑🏿‍🎤|👨‍🎤|👨🏻‍🎤|👨🏼‍🎤|👨🏽‍🎤|👨🏾‍🎤|👨🏿‍🎤|👩‍🎤|👩🏻‍🎤|👩🏼‍🎤|👩🏽‍🎤|👩🏾‍🎤|👩🏿‍🎤|🧑‍🎨|🧑🏻‍🎨|🧑🏼‍🎨|🧑🏽‍🎨|🧑🏾‍🎨|🧑🏿‍🎨|👨‍🎨|👨🏻‍🎨|👨🏼‍🎨|👨🏽‍🎨|👨🏾‍🎨|👨🏿‍🎨|👩‍🎨|👩🏻‍🎨
👩🏼‍🎨|👩🏽‍🎨|👩🏾‍🎨|👩🏿‍🎨|🧑‍✈️|🧑🏻‍✈️|🧑🏼‍✈️|🧑🏽‍✈️|🧑🏾‍✈️|🧑🏿‍✈️|👨‍✈️|👨🏻‍✈️|👨🏼‍✈️|👨🏽‍✈️|👨🏾‍✈️|👨🏿‍✈️|👩‍✈️|👩🏻‍✈️|👩🏼‍✈️|👩🏽‍✈️|👩🏾‍✈️|👩🏿‍✈️|🧑‍🚀|🧑🏻‍🚀|🧑🏼‍🚀|🧑🏽‍🚀|🧑🏾‍🚀|🧑🏿‍🚀|👨‍🚀|👨🏻‍🚀|👨🏼‍🚀|👨🏽‍🚀
👨🏾‍🚀|👨🏿‍🚀|👩‍🚀|👩🏻‍🚀|👩🏼‍🚀|👩🏽‍🚀|👩🏾‍🚀|👩🏿‍🚀|🧑‍🚒|🧑🏻‍🚒|🧑🏼‍🚒|🧑🏽‍🚒|🧑🏾‍🚒|🧑🏿‍🚒|👨‍🚒|👨🏻‍🚒|👨🏼‍🚒|👨🏽‍🚒|👨🏾‍🚒|👨🏿‍🚒|👩‍🚒|👩🏻‍🚒|👩🏼‍🚒|👩🏽‍🚒|👩🏾‍🚒|👩🏿‍🚒|👮|👮🏻|👮🏼|👮🏽|👮🏾|👮🏿
👮‍♂️|👮🏻‍♂️|👮🏼‍♂️|👮🏽‍♂️|👮🏾‍♂️|👮🏿‍♂️|👮‍♀️|👮🏻‍♀️|👮🏼‍♀️|👮🏽‍♀️|👮🏾‍♀️|👮🏿‍♀️|🕵️|🕵🏻|🕵🏼|🕵🏽|🕵🏾|🕵🏿|🕵️‍♂️|🕵🏻‍♂️|🕵🏼‍♂️|🕵🏽‍♂️|🕵🏾‍♂️|🕵🏿‍♂️|🕵️‍♀️|🕵🏻‍♀️|🕵🏼‍♀️|🕵🏽‍♀️|🕵🏾‍♀️|🕵🏿‍♀️|💂|💂🏻
💂🏼|💂🏽|💂🏾|💂🏿|💂‍♂️|💂🏻‍♂️|💂🏼‍♂️|💂🏽‍♂️|💂🏾‍♂️|💂🏿‍♂️|💂‍♀️|💂🏻‍♀️|💂🏼‍♀️|💂🏽‍♀️|💂🏾‍♀️|💂🏿‍♀️|🥷|🥷🏻|🥷🏼|🥷🏽|🥷🏾|🥷🏿|👷|👷🏻|👷🏼|👷🏽|👷🏾|👷🏿|👷‍♂️|👷🏻‍♂️|👷🏼‍♂️|👷🏽‍♂️
👷🏾‍♂️|👷🏿‍♂️|👷‍♀️|👷🏻‍♀️|👷🏼‍♀️|👷🏽‍♀️|👷🏾‍♀️|👷🏿‍♀️|🫅|🫅🏻|🫅🏼|🫅🏽|🫅🏾|🫅🏿|🤴|🤴🏻|🤴🏼|🤴🏽|🤴🏾|🤴🏿|👸|👸🏻|👸🏼|👸🏽|👸🏾|👸🏿|👳|👳🏻|👳🏼|👳🏽|👳🏾|👳🏿
👳‍♂️|👳🏻‍♂️|👳🏼‍♂️|👳🏽‍♂️|👳🏾‍♂️|👳🏿‍♂️|👳‍♀️|👳🏻‍♀️|👳🏼‍♀️|👳🏽‍♀️|👳🏾‍♀️|👳🏿‍♀️|👲|👲🏻|👲🏼|👲🏽|👲🏾|👲🏿|🧕|🧕🏻|🧕🏼|🧕🏽|🧕🏾|🧕🏿|🤵|🤵🏻|🤵🏼|🤵🏽|🤵🏾|🤵🏿|🤵‍♂️|🤵🏻‍♂️
🤵🏼‍♂️|🤵🏽‍♂️|🤵🏾‍♂️|🤵🏿‍♂️|🤵‍♀️|🤵🏻‍♀️|🤵🏼‍♀️|🤵🏽‍♀️|🤵🏾‍♀️|🤵🏿‍♀️|👰|👰🏻|👰🏼|👰🏽|👰🏾|👰🏿|👰‍♂️|👰🏻‍♂️|👰🏼‍♂️|👰🏽‍♂️|👰🏾‍♂️|👰🏿‍♂️|👰‍♀️|👰🏻‍♀️|👰🏼‍♀️|👰🏽‍♀️|👰🏾‍♀️|👰🏿‍♀️|🤰|🤰🏻|🤰🏼|🤰🏽
🤰🏾|🤰🏿|🫃|🫃🏻|🫃🏼|🫃🏽|🫃🏾|🫃🏿|🫄|🫄🏻|🫄🏼|🫄🏽|🫄🏾|🫄🏿|🤱|🤱🏻|🤱🏼|🤱🏽|🤱🏾|🤱🏿|👩‍🍼|👩🏻‍🍼|👩🏼‍🍼|👩🏽‍🍼|👩🏾‍🍼|👩🏿‍🍼|👨‍🍼|👨🏻‍🍼|👨🏼‍🍼|👨🏽‍🍼|👨🏾‍🍼|👨🏿‍🍼
🧑‍🍼|🧑🏻‍🍼|🧑🏼‍🍼|🧑🏽‍🍼|🧑🏾‍🍼|🧑🏿‍🍼|👼|👼🏻|👼🏼|👼🏽|👼🏾|👼🏿|🎅|🎅🏻|🎅🏼|🎅🏽|🎅🏾|🎅🏿|🤶|🤶🏻|🤶🏼|🤶🏽|🤶🏾|🤶🏿|🧑‍🎄|🧑🏻‍🎄|🧑🏼‍🎄|🧑🏽‍🎄|🧑🏾‍🎄|🧑🏿‍🎄|🦸|🦸🏻
🦸🏼|🦸🏽|🦸🏾|🦸🏿|🦸‍♂️|🦸🏻‍♂️|🦸🏼‍♂️|🦸🏽‍♂️|🦸🏾‍♂️|🦸🏿‍♂️|🦸‍♀️|🦸🏻‍♀️|🦸🏼‍♀️|🦸🏽‍♀️|🦸🏾‍♀️|🦸🏿‍♀️|🦹|🦹🏻|🦹🏼|🦹🏽|🦹🏾|🦹🏿|🦹‍♂️|🦹🏻‍♂️|🦹🏼‍♂️|🦹🏽‍♂️|🦹🏾‍♂️|🦹🏿‍♂️|🦹‍♀️|🦹🏻‍♀️|🦹🏼‍♀️|🦹🏽‍♀️
🦹🏾‍♀️|🦹🏿‍♀️|🧙|🧙🏻|🧙🏼|🧙🏽|🧙🏾|🧙🏿|🧙‍♂️|🧙🏻‍♂️|🧙🏼‍♂️|🧙🏽‍♂️|🧙🏾‍♂️|🧙🏿‍♂️|🧙‍♀️|🧙🏻‍♀️|🧙🏼‍♀️|🧙🏽‍♀️|🧙🏾‍♀️|🧙🏿‍♀️|🧚|🧚🏻|🧚🏼|🧚🏽|🧚🏾|🧚🏿|🧚‍♂️|🧚🏻‍♂️|🧚🏼‍♂️|🧚🏽‍♂️|🧚🏾‍♂️|🧚🏿‍♂️
🧚‍♀️|🧚🏻‍♀️|🧚🏼‍♀️|🧚🏽‍♀️|🧚🏾‍♀️|🧚🏿‍♀️|🧛|🧛🏻|🧛🏼|🧛🏽|🧛🏾|🧛🏿|🧛‍♂️|🧛🏻‍♂️|🧛🏼‍♂️|🧛🏽‍♂️|🧛🏾‍♂️|🧛🏿‍♂️|🧛‍♀️|🧛🏻‍♀️|🧛🏼‍♀️|🧛🏽‍♀️|🧛🏾‍♀️|🧛🏿‍♀️|🧜|🧜🏻|🧜🏼|🧜🏽|🧜🏾|🧜🏿|🧜‍♂️|🧜🏻‍♂️
🧜🏼‍♂️|🧜🏽‍♂️|🧜🏾‍♂️|🧜🏿‍♂️|🧜‍♀️|🧜🏻‍♀️|🧜🏼‍♀️|🧜🏽‍♀️|🧜🏾‍♀️|🧜🏿‍♀️|🧝|🧝🏻|🧝🏼|🧝🏽|🧝🏾|🧝🏿|🧝‍♂️|🧝🏻‍♂️|🧝🏼‍♂️|🧝🏽‍♂️|🧝🏾‍♂️|🧝🏿‍♂️|🧝‍♀️|🧝🏻‍♀️|🧝🏼‍♀️|🧝🏽‍♀️|🧝🏾‍♀️|🧝🏿‍♀️|🧞|🧞‍♂️|🧞‍♀️|🧟
🧟‍♂️|🧟‍♀️|🧌|🫈|💆|💆🏻|💆🏼|💆🏽|💆🏾|💆🏿|💆‍♂️|💆🏻‍♂️|💆🏼‍♂️|💆🏽‍♂️|💆🏾‍♂️|💆🏿‍♂️|💆‍♀️|💆🏻‍♀️|💆🏼‍♀️|💆🏽‍♀️|💆🏾‍♀️|💆🏿‍♀️|💇|💇🏻|💇🏼|💇🏽|💇🏾|💇🏿|💇‍♂️|💇🏻‍♂️|💇🏼‍♂️|💇🏽‍♂️
💇🏾‍♂️|💇🏿‍♂️|💇‍♀️|💇🏻‍♀️|💇🏼‍♀️|💇🏽‍♀️|💇🏾‍♀️|💇🏿‍♀️|🚶|🚶🏻|🚶🏼|🚶🏽|🚶🏾|🚶🏿|🚶‍♂️|🚶🏻‍♂️|🚶🏼‍♂️|🚶🏽‍♂️|🚶🏾‍♂️|🚶🏿‍♂️|🚶‍♀️|🚶🏻‍♀️|🚶🏼‍♀️|🚶🏽‍♀️|🚶🏾‍♀️|🚶🏿‍♀️|🚶‍➡️|🚶🏻‍➡️|🚶🏼‍➡️|🚶🏽‍➡️|🚶🏾‍➡️|🚶🏿‍➡️
🚶‍♀️‍➡️|🚶🏻‍♀️‍➡️|🚶🏼‍♀️‍➡️|🚶🏽‍♀️‍➡️|🚶🏾‍♀️‍➡️|🚶🏿‍♀️‍➡️|🚶‍♂️‍➡️|🚶🏻‍♂️‍➡️|🚶🏼‍♂️‍➡️|🚶🏽‍♂️‍➡️|🚶🏾‍♂️‍➡️|🚶🏿‍♂️‍➡️|🧍|🧍🏻|🧍🏼|🧍🏽|🧍🏾|🧍🏿|🧍‍♂️|🧍🏻‍♂️|🧍🏼‍♂️|🧍🏽‍♂️|🧍🏾‍♂️|🧍🏿‍♂️|🧍‍♀️|🧍🏻‍♀️|🧍🏼‍♀️|🧍🏽‍♀️|🧍🏾‍♀️|🧍🏿‍♀️|🧎|🧎🏻
🧎🏼|🧎🏽|🧎🏾|🧎🏿|🧎‍♂️|🧎🏻‍♂️|🧎🏼‍♂️|🧎🏽‍♂️|🧎🏾‍♂️|🧎🏿‍♂️|🧎‍♀️|🧎🏻‍♀️|🧎🏼‍♀️|🧎🏽‍♀️|🧎🏾‍♀️|🧎🏿‍♀️|🧎‍➡️|🧎🏻‍➡️|🧎🏼‍➡️|🧎🏽‍➡️|🧎🏾‍➡️|🧎🏿‍➡️|🧎‍♀️‍➡️|🧎🏻‍♀️‍➡️|🧎🏼‍♀️‍➡️|🧎🏽‍♀️‍➡️|🧎🏾‍♀️‍➡️|🧎🏿‍♀️‍➡️|🧎‍♂️‍➡️|🧎🏻‍♂️‍➡️|🧎🏼‍♂️‍➡️|🧎🏽‍♂️‍➡️
🧎🏾‍♂️‍➡️|🧎🏿‍♂️‍➡️|🧑‍🦯|🧑🏻‍🦯|🧑🏼‍🦯|🧑🏽‍🦯|🧑🏾‍🦯|🧑🏿‍🦯|🧑‍🦯‍➡️|🧑🏻‍🦯‍➡️|🧑🏼‍🦯‍➡️|🧑🏽‍🦯‍➡️|🧑🏾‍🦯‍➡️|🧑🏿‍🦯‍➡️|👨‍🦯|👨🏻‍🦯|👨🏼‍🦯|👨🏽‍🦯|👨🏾‍🦯|👨🏿‍🦯|👨‍🦯‍➡️|👨🏻‍🦯‍➡️|👨🏼‍🦯‍➡️|👨🏽‍🦯‍➡️|👨🏾‍🦯‍➡️|👨🏿‍🦯‍➡️|👩‍🦯|👩🏻‍🦯|👩🏼‍🦯|👩🏽‍🦯|👩🏾‍🦯|👩🏿‍🦯
👩‍🦯‍➡️|👩🏻‍🦯‍➡️|👩🏼‍🦯‍➡️|👩🏽‍🦯‍➡️|👩🏾‍🦯‍➡️|👩🏿‍🦯‍➡️|🧑‍🦼|🧑🏻‍🦼|🧑🏼‍🦼|🧑🏽‍🦼|🧑🏾‍🦼|🧑🏿‍🦼|🧑‍🦼‍➡️|🧑🏻‍🦼‍➡️|🧑🏼‍🦼‍➡️|🧑🏽‍🦼‍➡️|🧑🏾‍🦼‍➡️|🧑🏿‍🦼‍➡️|👨‍🦼|👨🏻‍🦼|👨🏼‍🦼|👨🏽‍🦼|👨🏾‍🦼|👨🏿‍🦼|👨‍🦼‍➡️|👨🏻‍🦼‍➡️|👨🏼‍🦼‍➡️|👨🏽‍🦼‍➡️|👨🏾‍🦼‍➡️|👨🏿‍🦼‍➡️|👩‍🦼|👩🏻‍🦼
👩🏼‍🦼|👩🏽‍🦼|👩🏾‍🦼|👩🏿‍🦼|👩‍🦼‍➡️|👩🏻‍🦼‍➡️|👩🏼‍🦼‍➡️|👩🏽‍🦼‍➡️|👩🏾‍🦼‍➡️|👩🏿‍🦼‍➡️|🧑‍🦽|🧑🏻‍🦽|🧑🏼‍🦽|🧑🏽‍🦽|🧑🏾‍🦽|🧑🏿‍🦽|🧑‍🦽‍➡️|🧑🏻‍🦽‍➡️|🧑🏼‍🦽‍➡️|🧑🏽‍🦽‍➡️|🧑🏾‍🦽‍➡️|🧑🏿‍🦽‍➡️|👨‍🦽|👨🏻‍🦽|👨🏼‍🦽|👨🏽‍🦽|👨🏾‍🦽|👨🏿‍🦽|👨‍🦽‍➡️|👨🏻‍🦽‍➡️|👨🏼‍🦽‍➡️|👨🏽‍🦽‍➡️
👨🏾‍🦽‍➡️|👨🏿‍🦽‍➡️|👩‍🦽|👩🏻‍🦽|👩🏼‍🦽|👩🏽‍🦽|👩🏾‍🦽|👩🏿‍🦽|👩‍🦽‍➡️|👩🏻‍🦽‍➡️|👩🏼‍🦽‍➡️|👩🏽‍🦽‍➡️|👩🏾‍🦽‍➡️|👩🏿‍🦽‍➡️|🏃|🏃🏻|🏃🏼|🏃🏽|🏃🏾|🏃🏿|🏃‍♂️|🏃🏻‍♂️|🏃🏼‍♂️|🏃🏽‍♂️|🏃🏾‍♂️|🏃🏿‍♂️|🏃‍♀️|🏃🏻‍♀️|🏃🏼‍♀️|🏃🏽‍♀️|🏃🏾‍♀️|🏃🏿‍♀️
🏃‍➡️|🏃🏻‍➡️|🏃🏼‍➡️|🏃🏽‍➡️|🏃🏾‍➡️|🏃🏿‍➡️|🏃‍♀️‍➡️|🏃🏻‍♀️‍➡️|🏃🏼‍♀️‍➡️|🏃🏽‍♀️‍➡️|🏃🏾‍♀️‍➡️|🏃🏿‍♀️‍➡️|🏃‍♂️‍➡️|🏃🏻‍♂️‍➡️|🏃🏼‍♂️‍➡️|🏃🏽‍♂️‍➡️|🏃🏾‍♂️‍➡️|🏃🏿‍♂️‍➡️|🧑‍🩰|🧑🏻‍🩰|🧑🏼‍🩰|🧑🏽‍🩰|🧑🏾‍🩰|🧑🏿‍🩰|💃|💃🏻|💃🏼|💃🏽|💃🏾|💃🏿|🕺|🕺🏻
🕺🏼|🕺🏽|🕺🏾|🕺🏿|🕴️|🕴🏻|🕴🏼|🕴🏽|🕴🏾|🕴🏿|👯|👯🏻|👯🏼|👯🏽|👯🏾|👯🏿|👯‍♂️|👯🏻‍♂️|👯🏼‍♂️|👯🏽‍♂️|👯🏾‍♂️|👯🏿‍♂️|👯‍♀️|👯🏻‍♀️|👯🏼‍♀️|👯🏽‍♀️|👯🏾‍♀️|👯🏿‍♀️|🧑🏻‍🐰‍🧑🏼|🧑🏻‍🐰‍🧑🏽|🧑🏻‍🐰‍🧑🏾|🧑🏻‍🐰‍🧑🏿
🧑🏼‍🐰‍🧑🏻|🧑🏼‍🐰‍🧑🏽|🧑🏼‍🐰‍🧑🏾|🧑🏼‍🐰‍🧑🏿|🧑🏽‍🐰‍🧑🏻|🧑🏽‍🐰‍🧑🏼|🧑🏽‍🐰‍🧑🏾|🧑🏽‍🐰‍🧑🏿|🧑🏾‍🐰‍🧑🏻|🧑🏾‍🐰‍🧑🏼|🧑🏾‍🐰‍🧑🏽|🧑🏾‍🐰‍🧑🏿|🧑🏿‍🐰‍🧑🏻|🧑🏿‍🐰‍🧑🏼|🧑🏿‍🐰‍🧑🏽|🧑🏿‍🐰‍🧑🏾|👨🏻‍🐰‍👨🏼|👨🏻‍🐰‍👨🏽|👨🏻‍🐰‍👨🏾|👨🏻‍🐰‍👨🏿|👨🏼‍🐰‍👨🏻|👨🏼‍🐰‍👨🏽|👨🏼‍🐰‍👨🏾|👨🏼‍🐰‍👨🏿|👨🏽‍🐰‍👨🏻|👨🏽‍🐰‍👨🏼|👨🏽‍🐰‍👨🏾|👨🏽‍🐰‍👨🏿|👨🏾‍🐰‍👨🏻|👨🏾‍🐰‍👨🏼|👨🏾‍🐰‍👨🏽|👨🏾‍🐰‍👨🏿
👨🏿‍🐰‍👨🏻|👨🏿‍🐰‍👨🏼|👨🏿‍🐰‍👨🏽|👨🏿‍🐰‍👨🏾|👩🏻‍🐰‍👩🏼|👩🏻‍🐰‍👩🏽|👩🏻‍🐰‍👩🏾|👩🏻‍🐰‍👩🏿|👩🏼‍🐰‍👩🏻|👩🏼‍🐰‍👩🏽|👩🏼‍🐰‍👩🏾|👩🏼‍🐰‍👩🏿|👩🏽‍🐰‍👩🏻|👩🏽‍🐰‍👩🏼|👩🏽‍🐰‍👩🏾|👩🏽‍🐰‍👩🏿|👩🏾‍🐰‍👩🏻|👩🏾‍🐰‍👩🏼|👩🏾‍🐰‍👩🏽|👩🏾‍🐰‍👩🏿|👩🏿‍🐰‍👩🏻|👩🏿‍🐰‍👩🏼|👩🏿‍🐰‍👩🏽|👩🏿‍🐰‍👩🏾|🧖|🧖🏻|🧖🏼|🧖🏽|🧖🏾|🧖🏿|🧖‍♂️|🧖🏻‍♂️
🧖🏼‍♂️|🧖🏽‍♂️|🧖🏾‍♂️|🧖🏿‍♂️|🧖‍♀️|🧖🏻‍♀️|🧖🏼‍♀️|🧖🏽‍♀️|🧖🏾‍♀️|🧖🏿‍♀️|🧗|🧗🏻|🧗🏼|🧗🏽|🧗🏾|🧗🏿|🧗‍♂️|🧗🏻‍♂️|🧗🏼‍♂️|🧗🏽‍♂️|🧗🏾‍♂️|🧗🏿‍♂️|🧗‍♀️|🧗🏻‍♀️|🧗🏼‍♀️|🧗🏽‍♀️|🧗🏾‍♀️|🧗🏿‍♀️|🤺|🏇|🏇🏻|🏇🏼
🏇🏽|🏇🏾|🏇🏿|⛷️|🏂|🏂🏻|🏂🏼|🏂🏽|🏂🏾|🏂🏿|🏌️|🏌🏻|🏌🏼|🏌🏽|🏌🏾|🏌🏿|🏌️‍♂️|🏌🏻‍♂️|🏌🏼‍♂️|🏌🏽‍♂️|🏌🏾‍♂️|🏌🏿‍♂️|🏌️‍♀️|🏌🏻‍♀️|🏌🏼‍♀️|🏌🏽‍♀️|🏌🏾‍♀️|🏌🏿‍♀️|🏄|🏄🏻|🏄🏼|🏄🏽
🏄🏾|🏄🏿|🏄‍♂️|🏄🏻‍♂️|🏄🏼‍♂️|🏄🏽‍♂️|🏄🏾‍♂️|🏄🏿‍♂️|🏄‍♀️|🏄🏻‍♀️|🏄🏼‍♀️|🏄🏽‍♀️|🏄🏾‍♀️|🏄🏿‍♀️|🚣|🚣🏻|🚣🏼|🚣🏽|🚣🏾|🚣🏿|🚣‍♂️|🚣🏻‍♂️|🚣🏼‍♂️|🚣🏽‍♂️|🚣🏾‍♂️|🚣🏿‍♂️|🚣‍♀️|🚣🏻‍♀️|🚣🏼‍♀️|🚣🏽‍♀️|🚣🏾‍♀️|🚣🏿‍♀️
🏊|🏊🏻|🏊🏼|🏊🏽|🏊🏾|🏊🏿|🏊‍♂️|🏊🏻‍♂️|🏊🏼‍♂️|🏊🏽‍♂️|🏊🏾‍♂️|🏊🏿‍♂️|🏊‍♀️|🏊🏻‍♀️|🏊🏼‍♀️|🏊🏽‍♀️|🏊🏾‍♀️|🏊🏿‍♀️|⛹️|⛹🏻|⛹🏼|⛹🏽|⛹🏾|⛹🏿|⛹️‍♂️|⛹🏻‍♂️|⛹🏼‍♂️|⛹🏽‍♂️|⛹🏾‍♂️|⛹🏿‍♂️|⛹️‍♀️|⛹🏻‍♀️
⛹🏼‍♀️|⛹🏽‍♀️|⛹🏾‍♀️|⛹🏿‍♀️|🏋️|🏋🏻|🏋🏼|🏋🏽|🏋🏾|🏋🏿|🏋️‍♂️|🏋🏻‍♂️|🏋🏼‍♂️|🏋🏽‍♂️|🏋🏾‍♂️|🏋🏿‍♂️|🏋️‍♀️|🏋🏻‍♀️|🏋🏼‍♀️|🏋🏽‍♀️|🏋🏾‍♀️|🏋🏿‍♀️|🚴|🚴🏻|🚴🏼|🚴🏽|🚴🏾|🚴🏿|🚴‍♂️|🚴🏻‍♂️|🚴🏼‍♂️|🚴🏽‍♂️
🚴🏾‍♂️|🚴🏿‍♂️|🚴‍♀️|🚴🏻‍♀️|🚴🏼‍♀️|🚴🏽‍♀️|🚴🏾‍♀️|🚴🏿‍♀️|🚵|🚵🏻|🚵🏼|🚵🏽|🚵🏾|🚵🏿|🚵‍♂️|🚵🏻‍♂️|🚵🏼‍♂️|🚵🏽‍♂️|🚵🏾‍♂️|🚵🏿‍♂️|🚵‍♀️|🚵🏻‍♀️|🚵🏼‍♀️|🚵🏽‍♀️|🚵🏾‍♀️|🚵🏿‍♀️|🤸|🤸🏻|🤸🏼|🤸🏽|🤸🏾|🤸🏿
🤸‍♂️|🤸🏻‍♂️|🤸🏼‍♂️|🤸🏽‍♂️|🤸🏾‍♂️|🤸🏿‍♂️|🤸‍♀️|🤸🏻‍♀️|🤸🏼‍♀️|🤸🏽‍♀️|🤸🏾‍♀️|🤸🏿‍♀️|🤼|🤼🏻|🤼🏼|🤼🏽|🤼🏾|🤼🏿|🤼‍♂️|🤼🏻‍♂️|🤼🏼‍♂️|🤼🏽‍♂️|🤼🏾‍♂️|🤼🏿‍♂️|🤼‍♀️|🤼🏻‍♀️|🤼🏼‍♀️|🤼🏽‍♀️|🤼🏾‍♀️|🤼🏿‍♀️|🧑🏻‍🫯‍🧑🏼|🧑🏻‍🫯‍🧑🏽
🧑🏻‍🫯‍🧑🏾|🧑🏻‍🫯‍🧑🏿|🧑🏼‍🫯‍🧑🏻|🧑🏼‍🫯‍🧑🏽|🧑🏼‍🫯‍🧑🏾|🧑🏼‍🫯‍🧑🏿|🧑🏽‍🫯‍🧑🏻|🧑🏽‍🫯‍🧑🏼|🧑🏽‍🫯‍🧑🏾|🧑🏽‍🫯‍🧑🏿|🧑🏾‍🫯‍🧑🏻|🧑🏾‍🫯‍🧑🏼|🧑🏾‍🫯‍🧑🏽|🧑🏾‍🫯‍🧑🏿|🧑🏿‍🫯‍🧑🏻|🧑🏿‍🫯‍🧑🏼|🧑🏿‍🫯‍🧑🏽|🧑🏿‍🫯‍🧑🏾|👨🏻‍🫯‍👨🏼|👨🏻‍🫯‍👨🏽|👨🏻‍🫯‍👨🏾|👨🏻‍🫯‍👨🏿|👨🏼‍🫯‍👨🏻|👨🏼‍🫯‍👨🏽|👨🏼‍🫯‍👨🏾|👨🏼‍🫯‍👨🏿|👨🏽‍🫯‍👨🏻|👨🏽‍🫯‍👨🏼|👨🏽‍🫯‍👨🏾|👨🏽‍🫯‍👨🏿|👨🏾‍🫯‍👨🏻|👨🏾‍🫯‍👨🏼
👨🏾‍🫯‍👨🏽|👨🏾‍🫯‍👨🏿|👨🏿‍🫯‍👨🏻|👨🏿‍🫯‍👨🏼|👨🏿‍🫯‍👨🏽|👨🏿‍🫯‍👨🏾|👩🏻‍🫯‍👩🏼|👩🏻‍🫯‍👩🏽|👩🏻‍🫯‍👩🏾|👩🏻‍🫯‍👩🏿|👩🏼‍🫯‍👩🏻|👩🏼‍🫯‍👩🏽|👩🏼‍🫯‍👩🏾|👩🏼‍🫯‍👩🏿|👩🏽‍🫯‍👩🏻|👩🏽‍🫯‍👩🏼|👩🏽‍🫯‍👩🏾|👩🏽‍🫯‍👩🏿|👩🏾‍🫯‍👩🏻|👩🏾‍🫯‍👩🏼|👩🏾‍🫯‍👩🏽|👩🏾‍🫯‍👩🏿|👩🏿‍🫯‍👩🏻|👩🏿‍🫯‍👩🏼|👩🏿‍🫯‍👩🏽|👩🏿‍🫯‍👩🏾|🤽|🤽🏻|🤽🏼|🤽🏽|🤽🏾|🤽🏿
🤽‍♂️|🤽🏻‍♂️|🤽🏼‍♂️|🤽🏽‍♂️|🤽🏾‍♂️|🤽🏿‍♂️|🤽‍♀️|🤽🏻‍♀️|🤽🏼‍♀️|🤽🏽‍♀️|🤽🏾‍♀️|🤽🏿‍♀️|🤾|🤾🏻|🤾🏼|🤾🏽|🤾🏾|🤾🏿|🤾‍♂️|🤾🏻‍♂️|🤾🏼‍♂️|🤾🏽‍♂️|🤾🏾‍♂️|🤾🏿‍♂️|🤾‍♀️|🤾🏻‍♀️|🤾🏼‍♀️|🤾🏽‍♀️|🤾🏾‍♀️|🤾🏿‍♀️|🤹|🤹🏻
🤹🏼|🤹🏽|🤹🏾|🤹🏿|🤹‍♂️|🤹🏻‍♂️|🤹🏼‍♂️|🤹🏽‍♂️|🤹🏾‍♂️|🤹🏿‍♂️|🤹‍♀️|🤹🏻‍♀️|🤹🏼‍♀️|🤹🏽‍♀️|🤹🏾‍♀️|🤹🏿‍♀️|🧘|🧘🏻|🧘🏼|🧘🏽|🧘🏾|🧘🏿|🧘‍♂️|🧘🏻‍♂️|🧘🏼‍♂️|🧘🏽‍♂️|🧘🏾‍♂️|🧘🏿‍♂️|🧘‍♀️|🧘🏻‍♀️|🧘🏼‍♀️|🧘🏽‍♀️
🧘🏾‍♀️|🧘🏿‍♀️|🛀|🛀🏻|🛀🏼|🛀🏽|🛀🏾|🛀🏿|🛌|🛌🏻|🛌🏼|🛌🏽|🛌🏾|🛌🏿|🧑‍🤝‍🧑|🧑🏻‍🤝‍🧑🏻|🧑🏻‍🤝‍🧑🏼|🧑🏻‍🤝‍🧑🏽|🧑🏻‍🤝‍🧑🏾|🧑🏻‍🤝‍🧑🏿|🧑🏼‍🤝‍🧑🏻|🧑🏼‍🤝‍🧑🏼|🧑🏼‍🤝‍🧑🏽|🧑🏼‍🤝‍🧑🏾|🧑🏼‍🤝‍🧑🏿|🧑🏽‍🤝‍🧑🏻|🧑🏽‍🤝‍🧑🏼|🧑🏽‍🤝‍🧑🏽|🧑🏽‍🤝‍🧑🏾|🧑🏽‍🤝‍🧑🏿|🧑🏾‍🤝‍🧑🏻|🧑🏾‍🤝‍🧑🏼
🧑🏾‍🤝‍🧑🏽|🧑🏾‍🤝‍🧑🏾|🧑🏾‍🤝‍🧑🏿|🧑🏿‍🤝‍🧑🏻|🧑🏿‍🤝‍🧑🏼|🧑🏿‍🤝‍🧑🏽|🧑🏿‍🤝‍🧑🏾|🧑🏿‍🤝‍🧑🏿|👭|👭🏻|👩🏻‍🤝‍👩🏼|👩🏻‍🤝‍👩🏽|👩🏻‍🤝‍👩🏾|👩🏻‍🤝‍👩🏿|👩🏼‍🤝‍👩🏻|👭🏼|👩🏼‍🤝‍👩🏽|👩🏼‍🤝‍👩🏾|👩🏼‍🤝‍👩🏿|👩🏽‍🤝‍👩🏻|👩🏽‍🤝‍👩🏼|👭🏽|👩🏽‍🤝‍👩🏾|👩🏽‍🤝‍👩🏿|👩🏾‍🤝‍👩🏻|👩🏾‍🤝‍👩🏼|👩🏾‍🤝‍👩🏽|👭🏾|👩🏾‍🤝‍👩🏿|👩🏿‍🤝‍👩🏻|👩🏿‍🤝‍👩🏼|👩🏿‍🤝‍👩🏽
👩🏿‍🤝‍👩🏾|👭🏿|👫|👫🏻|👩🏻‍🤝‍👨🏼|👩🏻‍🤝‍👨🏽|👩🏻‍🤝‍👨🏾|👩🏻‍🤝‍👨🏿|👩🏼‍🤝‍👨🏻|👫🏼|👩🏼‍🤝‍👨🏽|👩🏼‍🤝‍👨🏾|👩🏼‍🤝‍👨🏿|👩🏽‍🤝‍👨🏻|👩🏽‍🤝‍👨🏼|👫🏽|👩🏽‍🤝‍👨🏾|👩🏽‍🤝‍👨🏿|👩🏾‍🤝‍👨🏻|👩🏾‍🤝‍👨🏼|👩🏾‍🤝‍👨🏽|👫🏾|👩🏾‍🤝‍👨🏿|👩🏿‍🤝‍👨🏻|👩🏿‍🤝‍👨🏼|👩🏿‍🤝‍👨🏽|👩🏿‍🤝‍👨🏾|👫🏿|👬|👬🏻|👨🏻‍🤝‍👨🏼|👨🏻‍🤝‍👨🏽
👨🏻‍🤝‍👨🏾|👨🏻‍🤝‍👨🏿|👨🏼‍🤝‍👨🏻|👬🏼|👨🏼‍🤝‍👨🏽|👨🏼‍🤝‍👨🏾|👨🏼‍🤝‍👨🏿|👨🏽‍🤝‍👨🏻|👨🏽‍🤝‍👨🏼|👬🏽|👨🏽‍🤝‍👨🏾|👨🏽‍🤝‍👨🏿|👨🏾‍🤝‍👨🏻|👨🏾‍🤝‍👨🏼|👨🏾‍🤝‍👨🏽|👬🏾|👨🏾‍🤝‍👨🏿|👨🏿‍🤝‍👨🏻|👨🏿‍🤝‍👨🏼|👨🏿‍🤝‍👨🏽|👨🏿‍🤝‍👨🏾|👬🏿|💏|💏🏻|💏🏼|💏🏽|💏🏾|💏🏿|🧑🏻‍❤️‍💋‍🧑🏼|🧑🏻‍❤️‍💋‍🧑🏽|🧑🏻‍❤️‍💋‍🧑🏾|🧑🏻‍❤️‍💋‍🧑🏿
🧑🏼‍❤️‍💋‍🧑🏻|🧑🏼‍❤️‍💋‍🧑🏽|🧑🏼‍❤️‍💋‍🧑🏾|🧑🏼‍❤️‍💋‍🧑🏿|🧑🏽‍❤️‍💋‍🧑🏻|🧑🏽‍❤️‍💋‍🧑🏼|🧑🏽‍❤️‍💋‍🧑🏾|🧑🏽‍❤️‍💋‍🧑🏿|🧑🏾‍❤️‍💋‍🧑🏻|🧑🏾‍❤️‍💋‍🧑🏼|🧑🏾‍❤️‍💋‍🧑🏽|🧑🏾‍❤️‍💋‍🧑🏿|🧑🏿‍❤️‍💋‍🧑🏻|🧑🏿‍❤️‍💋‍🧑🏼|🧑🏿‍❤️‍💋‍🧑🏽|🧑🏿‍❤️‍💋‍🧑🏾|👩‍❤️‍💋‍👨|👩🏻‍❤️‍💋‍👨🏻|👩🏻‍❤️‍💋‍👨🏼|👩🏻‍❤️‍💋‍👨🏽|👩🏻‍❤️‍💋‍👨🏾|👩🏻‍❤️‍💋‍👨🏿|👩🏼‍❤️‍💋‍👨🏻|👩🏼‍❤️‍💋‍👨🏼|👩🏼‍❤️‍💋‍👨🏽|👩🏼‍❤️‍💋‍👨🏾|👩🏼‍❤️‍💋‍👨🏿|👩🏽‍❤️‍💋‍👨🏻|👩🏽‍❤️‍💋‍👨🏼|👩🏽‍❤️‍💋‍👨🏽|👩🏽‍❤️‍💋‍👨🏾|👩🏽‍❤️‍💋‍👨🏿
👩🏾‍❤️‍💋‍👨🏻|👩🏾‍❤️‍💋‍👨🏼|👩🏾‍❤️‍💋‍👨🏽|👩🏾‍❤️‍💋‍👨🏾|👩🏾‍❤️‍💋‍👨🏿|👩🏿‍❤️‍💋‍👨🏻|👩🏿‍❤️‍💋‍👨🏼|👩🏿‍❤️‍💋‍👨🏽|👩🏿‍❤️‍💋‍👨🏾|👩🏿‍❤️‍💋‍👨🏿|👨‍❤️‍💋‍👨|👨🏻‍❤️‍💋‍👨🏻|👨🏻‍❤️‍💋‍👨🏼|👨🏻‍❤️‍💋‍👨🏽|👨🏻‍❤️‍💋‍👨🏾|👨🏻‍❤️‍💋‍👨🏿|👨🏼‍❤️‍💋‍👨🏻|👨🏼‍❤️‍💋‍👨🏼|👨🏼‍❤️‍💋‍👨🏽|👨🏼‍❤️‍💋‍👨🏾|👨🏼‍❤️‍💋‍👨🏿|👨🏽‍❤️‍💋‍👨🏻|👨🏽‍❤️‍💋‍👨🏼|👨🏽‍❤️‍💋‍👨🏽|👨🏽‍❤️‍💋‍👨🏾|👨🏽‍❤️‍💋‍👨🏿|👨🏾‍❤️‍💋‍👨🏻|👨🏾‍❤️‍💋‍👨🏼|👨🏾‍❤️‍💋‍👨🏽|👨🏾‍❤️‍💋‍👨🏾|👨🏾‍❤️‍💋‍👨🏿|👨🏿‍❤️‍💋‍👨🏻
👨🏿‍❤️‍💋‍👨🏼|👨🏿‍❤️‍💋‍👨🏽|👨🏿‍❤️‍💋‍👨🏾|👨🏿‍❤️‍💋‍👨🏿|👩‍❤️‍💋‍👩|👩🏻‍❤️‍💋‍👩🏻|👩🏻‍❤️‍💋‍👩🏼|👩🏻‍❤️‍💋‍👩🏽|👩🏻‍❤️‍💋‍👩🏾|👩🏻‍❤️‍💋‍👩🏿|👩🏼‍❤️‍💋‍👩🏻|👩🏼‍❤️‍💋‍👩🏼|👩🏼‍❤️‍💋‍👩🏽|👩🏼‍❤️‍💋‍👩🏾|👩🏼‍❤️‍💋‍👩🏿|👩🏽‍❤️‍💋‍👩🏻|👩🏽‍❤️‍💋‍👩🏼|👩🏽‍❤️‍💋‍👩🏽|👩🏽‍❤️‍💋‍👩🏾|👩🏽‍❤️‍💋‍👩🏿|👩🏾‍❤️‍💋‍👩🏻|👩🏾‍❤️‍💋‍👩🏼|👩🏾‍❤️‍💋‍👩🏽|👩🏾‍❤️‍💋‍👩🏾|👩🏾‍❤️‍💋‍👩🏿|👩🏿‍❤️‍💋‍👩🏻|👩🏿‍❤️‍💋‍👩🏼|👩🏿‍❤️‍💋‍👩🏽|👩🏿‍❤️‍💋‍👩🏾|👩🏿‍❤️‍💋‍👩🏿|💑|💑🏻
💑🏼|💑🏽|💑🏾|💑🏿|🧑🏻‍❤️‍🧑🏼|🧑🏻‍❤️‍🧑🏽|🧑🏻‍❤️‍🧑🏾|🧑🏻‍❤️‍🧑🏿|🧑🏼‍❤️‍🧑🏻|🧑🏼‍❤️‍🧑🏽|🧑🏼‍❤️‍🧑🏾|🧑🏼‍❤️‍🧑🏿|🧑🏽‍❤️‍🧑🏻|🧑🏽‍❤️‍🧑🏼|🧑🏽‍❤️‍🧑🏾|🧑🏽‍❤️‍🧑🏿|🧑🏾‍❤️‍🧑🏻|🧑🏾‍❤️‍🧑🏼|🧑🏾‍❤️‍🧑🏽|🧑🏾‍❤️‍🧑🏿|🧑🏿‍❤️‍🧑🏻|🧑🏿‍❤️‍🧑🏼|🧑🏿‍❤️‍🧑🏽|🧑🏿‍❤️‍🧑🏾|👩‍❤️‍👨|👩🏻‍❤️‍👨🏻|👩🏻‍❤️‍👨🏼|👩🏻‍❤️‍👨🏽|👩🏻‍❤️‍👨🏾|👩🏻‍❤️‍👨🏿|👩🏼‍❤️‍👨🏻|👩🏼‍❤️‍👨🏼
👩🏼‍❤️‍👨🏽|👩🏼‍❤️‍👨🏾|👩🏼‍❤️‍👨🏿|👩🏽‍❤️‍👨🏻|👩🏽‍❤️‍👨🏼|👩🏽‍❤️‍👨🏽|👩🏽‍❤️‍👨🏾|👩🏽‍❤️‍👨🏿|👩🏾‍❤️‍👨🏻|👩🏾‍❤️‍👨🏼|👩🏾‍❤️‍👨🏽|👩🏾‍❤️‍👨🏾|👩🏾‍❤️‍👨🏿|👩🏿‍❤️‍👨🏻|👩🏿‍❤️‍👨🏼|👩🏿‍❤️‍👨🏽|👩🏿‍❤️‍👨🏾|👩🏿‍❤️‍👨🏿|👨‍❤️‍👨|👨🏻‍❤️‍👨🏻|👨🏻‍❤️‍👨🏼|👨🏻‍❤️‍👨🏽|👨🏻‍❤️‍👨🏾|👨🏻‍❤️‍👨🏿|👨🏼‍❤️‍👨🏻|👨🏼‍❤️‍👨🏼|👨🏼‍❤️‍👨🏽|👨🏼‍❤️‍👨🏾|👨🏼‍❤️‍👨🏿|👨🏽‍❤️‍👨🏻|👨🏽‍❤️‍👨🏼|👨🏽‍❤️‍👨🏽
👨🏽‍❤️‍👨🏾|👨🏽‍❤️‍👨🏿|👨🏾‍❤️‍👨🏻|👨🏾‍❤️‍👨🏼|👨🏾‍❤️‍👨🏽|👨🏾‍❤️‍👨🏾|👨🏾‍❤️‍👨🏿|👨🏿‍❤️‍👨🏻|👨🏿‍❤️‍👨🏼|👨🏿‍❤️‍👨🏽|👨🏿‍❤️‍👨🏾|👨🏿‍❤️‍👨🏿|👩‍❤️‍👩|👩🏻‍❤️‍👩🏻|👩🏻‍❤️‍👩🏼|👩🏻‍❤️‍👩🏽|👩🏻‍❤️‍👩🏾|👩🏻‍❤️‍👩🏿|👩🏼‍❤️‍👩🏻|👩🏼‍❤️‍👩🏼|👩🏼‍❤️‍👩🏽|👩🏼‍❤️‍👩🏾|👩🏼‍❤️‍👩🏿|👩🏽‍❤️‍👩🏻|👩🏽‍❤️‍👩🏼|👩🏽‍❤️‍👩🏽|👩🏽‍❤️‍👩🏾|👩🏽‍❤️‍👩🏿|👩🏾‍❤️‍👩🏻|👩🏾‍❤️‍👩🏼|👩🏾‍❤️‍👩🏽|👩🏾‍❤️‍👩🏾
👩🏾‍❤️‍👩🏿|👩🏿‍❤️‍👩🏻|👩🏿‍❤️‍👩🏼|👩🏿‍❤️‍👩🏽|👩🏿‍❤️‍👩🏾|👩🏿‍❤️‍👩🏿|👨‍👩‍👦|👨‍👩‍👧|👨‍👩‍👧‍👦|👨‍👩‍👦‍👦|👨‍👩‍👧‍👧|👨‍👨‍👦|👨‍👨‍👧|👨‍👨‍👧‍👦|👨‍👨‍👦‍👦|👨‍👨‍👧‍👧|👩‍👩‍👦|👩‍👩‍👧|👩‍👩‍👧‍👦|👩‍👩‍👦‍👦|👩‍👩‍👧‍👧|👨‍👦|👨‍👦‍👦|👨‍👧|👨‍👧‍👦|👨‍👧‍👧|👩‍👦|👩‍👦‍👦|👩‍👧|👩‍👧‍👦|👩‍👧‍👧|🗣️
👤|👥|🫂|👪|🧑‍🧑‍🧒|🧑‍🧑‍🧒‍🧒|🧑‍🧒|🧑‍🧒‍🧒|👣|🫆|🐵|🐒|🦍|🦧|🐶|🐕|🦮|🐕‍🦺|🐩|🐺|🦊|🦝|🐱|🐈|🐈‍⬛|🦁|🐯|🐅|🐆|🐴|🫎|🫏
🐎|🦄|🦓|🦌|🦬|🐮|🐂|🐃|🐄|🐷|🐖|🐗|🐽|🐏|🐑|🐐|🐪|🐫|🦙|🦒|🐘|🦣|🦏|🦛|🐭|🐁|🐀|🐹|🐰|🐇|🐿️|🦫
🦔|🦇|🐻|🐻‍❄️|🐨|🐼|🦥|🦦|🦨|🦘|🦡|🐾|🦃|🐔|🐓|🐣|🐤|🐥|🐦|🐧|🕊️|🦅|🦆|🦢|🦉|🦤|🪶|🦩|🦚|🦜|🪽|🐦‍⬛
🪿|🐦‍🔥|🐸|🐊|🐢|🦎|🐍|🐲|🐉|🦕|🦖|🐳|🐋|🐬|🫍|🦭|🐟|🐠|🐡|🦈|🐙|🐚|🪸|🪼|🦀|🦞|🦐|🦑|🦪|🐌|🦋|🫌
🐛|🐜|🐝|🪲|🐞|🦗|🪳|🕷️|🕸️|🦂|🦟|🪰|🪱|🦠|💐|🌸|💮|🪷|🏵️|🌹|🥀|🌺|🌻|🌼|🌷|🪻|🌱|🪴|🌲|🌳|🌴|🌵
🌾|🌿|☘️|🍀|🍁|🍂|🍃|🪹|🪺|🍄|🪾|🍇|🍈|🍉|🍊|🍋|🍋‍🟩|🍌|🍍|🥭|🍎|🍏|🍐|🍑|🍒|🍓|🫐|🥝|🍅|🫒|🥥|🥑
🍆|🥔|🥕|🌽|🌶️|🫑|🥒|🫝|🥬|🥦|🧄|🧅|🥜|🫘|🌰|🫚|🫛|🍄‍🟫|🫜|🍞|🥐|🥖|🫓|🥨|🥯|🥞|🧇|🧀|🍖|🍗|🥩|🥓
🍔|🍟|🍕|🌭|🥪|🌮|🌯|🫔|🥙|🧆|🥚|🍳|🥘|🍲|🫕|🥣|🥗|🍿|🧈|🧂|🥫|🍱|🍘|🍙|🍚|🍛|🍜|🍝|🍠|🍢|🍣|🍤
🍥|🥮|🍡|🥟|🥠|🥡|🍦|🍧|🍨|🍩|🍪|🎂|🍰|🧁|🥧|🍫|🍬|🍭|🍮|🍯|🍼|🥛|☕|🫖|🍵|🍶|🍾|🍷|🍸|🍹|🍺|🍻
🥂|🥃|🫗|🥤|🧋|🧃|🧉|🧊|🥢|🍽️|🍴|🥄|🔪|🫙|🏺|🌍|🌎|🌏|🌐|🗺️|🗾|🧭|🏔️|⛰️|🛘|🌋|🗻|🏕️|🏖️|🏜️|🏝️|🏞️
🏟️|🏛️|🏗️|🧱|🪨|🪵|🛖|🏘️|🏚️|🏠|🏡|🏢|🏣|🏤|🏥|🏦|🏨|🏩|🏪|🏫|🏬|🏭|🏯|🏰|💒|🗼|🗽|⛪|🕌|🛕|🕍|⛩️
🕋|⛲|⛺|🌁|🌃|🏙️|🌄|🌅|🌆|🌇|🌉|♨️|🎠|🛝|🎡|🎢|💈|🎪|🚂|🚃|🚄|🚅|🚆|🚇|🚈|🚉|🚊|🚝|🚞|🚋|🚌|🚍
🚎|🚐|🚑|🚒|🚓|🚔|🚕|🚖|🚗|🚘|🚙|🛻|🚚|🚛|🚜|🏎️|🏍️|🛵|🦽|🦼|🛺|🚲|🛴|🛹|🛼|🚏|🛣️|🛤️|🛢️|⛽|🛞|🚨
🚥|🚦|🛑|🚧|🛙|⚓|🛟|⛵|🛶|🚤|🛳️|⛴️|🛥️|🚢|✈️|🛩️|🛫|🛬|🪂|💺|🚁|🚟|🚠|🚡|🛰️|🚀|🛸|🛎️|🧳|⌛|⏳|⌚
⏰|⏱️|⏲️|🕰️|🕛|🕧|🕐|🕜|🕑|🕝|🕒|🕞|🕓|🕟|🕔|🕠|🕕|🕡|🕖|🕢|🕗|🕣|🕘|🕤|🕙|🕥|🕚|🕦|🌑|🌒|🌓|🌔
🌕|🌖|🌗|🌘|🌙|🌚|🌛|🌜|🌡️|☀️|🌝|🌞|🪐|⭐|🌟|🌠|🌌|☁️|⛅|⛈️|🌤️|🌥️|🌦️|🌧️|🌨️|🌩️|🌪️|🌫️|🌬️|🌀|🌈|🌂
☂️|☔|⛱️|⚡|❄️|☃️|⛄|☄️|🪋|🔥|💧|🌊|🎃|🎄|🎆|🎇|🧨|✨|🎈|🎉|🎊|🎋|🎍|🎎|🎏|🎐|🎑|🧧|🎀|🎁|🎗️|🎟️
🎫|🎖️|🏆|🏅|🥇|🥈|🥉|⚽|⚾|🥎|🏀|🏐|🏈|🏉|🎾|🥏|🎳|🏏|🏑|🏒|🥍|🏓|🏸|🥊|🥋|🥅|⛳|⛸️|🎣|🤿|🎽|🎿
🛷|🥌|🎯|🪀|🪁|🔫|🎱|🔮|🪄|🎮|🕹️|🎰|🎲|🧩|🧸|🪅|🪩|🪆|♠️|♥️|♦️|♣️|♟️|🃏|🀄|🎴|🎭|🖼️|🎨|🧵|🪡|🧶
🪢|👓|🕶️|🥽|🥼|🦺|👔|👕|👖|🧣|🧤|🧥|🧦|👗|👘|🥻|🩱|🩲|🩳|👙|👚|🪭|👛|👜|👝|🛍️|🎒|🩴|👞|👟|🥾|🥿
👠|👡|🩰|👢|🪮|👑|👒|🎩|🎓|🧢|🪖|⛑️|📿|💄|💍|💎|🔇|🔈|🔉|🔊|📢|📣|📯|🔔|🔕|🎼|🎵|🎶|🎙️|🎚️|🎛️|🎤
🎧|📻|🎷|🎺|🪊|🪗|🎸|🎹|🎻|🪕|🥁|🪘|🪇|🪈|🪉|📱|📲|☎️|📞|📟|📠|🔋|🪫|🔌|💻|🖥️|🖨️|⌨️|🖱️|🖲️|💽|💾
💿|📀|🧮|🎥|🎞️|📽️|🎬|📺|📷|📸|📹|📼|🔍|🔎|🕯️|💡|🔦|🏮|🪔|📔|📕|📖|📗|📘|📙|📚|📓|📒|📃|📜|📄|📰
🗞️|📑|🔖|🏷️|🪙|💰|🪎|💴|💵|💶|💷|💸|💳|🧾|💹|✉️|📧|📨|📩|📤|📥|📦|📫|📪|📬|📭|📮|🗳️|✏️|✒️|🖋️|🖊️
🖌️|🖍️|📝|🪌|💼|📁|📂|🗂️|📅|📆|🗒️|🗓️|📇|📈|📉|📊|📋|📌|📍|📎|🖇️|📏|📐|✂️|🗃️|🗄️|🗑️|🔒|🔓|🔏|🔐|🔑
🗝️|🪍|🔨|🪓|⛏️|⚒️|🛠️|🗡️|⚔️|💣|🪃|🏹|🛡️|🪚|🔧|🪛|🔩|⚙️|🗜️|⚖️|🦯|🔗|⛓️‍💥|⛓️|🪝|🧰|🧲|🪜|🪏|⚗️|🧪|🧫
🧬|🔬|🔭|📡|💉|🩸|💊|🩹|🩼|🩺|🩻|🚪|🛗|🪞|🪟|🛏️|🛋️|🪑|🚽|🪠|🚿|🛁|🪤|🪒|🧴|🧷|🧹|🧺|🧻|🪣|🧼|🫧
🪥|🧽|🧯|🛒|🚬|⚰️|🪦|⚱️|🧿|🪬|🗿|🪧|🪪|🏧|🚮|🚰|♿|🚹|🚺|🚻|🚼|🚾|🛂|🛃|🛄|🛅|⚠️|🚸|⛔|🚫|🚳|🚭
🚯|🚱|🚷|📵|🔞|☢️|☣️|⬆️|↗️|➡️|↘️|⬇️|↙️|⬅️|↖️|↕️|↔️|↩️|↪️|⤴️|⤵️|🔃|🔄|🔙|🔚|🔛|🔜|🔝|🛐|⚛️|🕉️|✡️
☸️|☯️|✝️|☦️|☪️|☮️|🕎|🔯|🪯|♈|♉|♊|♋|♌|♍|♎|♏|♐|♑|♒|♓|⛎|🔀|🔁|🔂|▶️|⏩|⏭️|⏯️|◀️|⏪|⏮️
🔼|⏫|🔽|⏬|⏸️|⏹️|⏺️|⏏️|🎦|🔅|🔆|📶|🛜|📳|📴|♀️|♂️|⚧️|✖️|➕|➖|➗|🟰|♾️|‼️|⁉️|❓|❔|❕|❗|〰️|💱
💲|⚕️|♻️|⚜️|🔱|📛|🔰|⭕|✅|☑️|✔️|❌|❎|➰|➿|〽️|✳️|✴️|❇️|©️|®️|™️|🫟|#️⃣|*️⃣|0️⃣|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣
7️⃣|8️⃣|9️⃣|🔟|🔠|🔡|🔢|🔣|🔤|🅰️|🆎|🅱️|🆑|🆒|🆓|ℹ️|🆔|Ⓜ️|🆕|🆖|🅾️|🆗|🅿️|🆘|🆙|🆚|🈁|🈂️|🈷️|🈶|🈯|🉐
🈹|🈚|🈲|🉑|🈸|🈴|🈳|㊗️|㊙️|🈺|🈵|🔴|🟠|🟡|🟢|🔵|🟣|🟤|⚫|⚪|🟥|🟧|🟨|🟩|🟦|🟪|🟫|⬛|⬜|◼️|◻️|◾
◽|▪️|▫️|🔶|🔷|🔸|🔹|🔺|🔻|💠|🔘|🔳|🔲|🏁|🚩|🎌|🏴|🏳️|🏳️‍🌈|🏳️‍⚧️|🏴‍☠️|🇦🇨|🇦🇩|🇦🇪|🇦🇫|🇦🇬|🇦🇮|🇦🇱|🇦🇲|🇦🇴|🇦🇶|🇦🇷
🇦🇸|🇦🇹|🇦🇺|🇦🇼|🇦🇽|🇦🇿|🇧🇦|🇧🇧|🇧🇩|🇧🇪|🇧🇫|🇧🇬|🇧🇭|🇧🇮|🇧🇯|🇧🇱|🇧🇲|🇧🇳|🇧🇴|🇧🇶|🇧🇷|🇧🇸|🇧🇹|🇧🇻|🇧🇼|🇧🇾|🇧🇿|🇨🇦|🇨🇨|🇨🇩|🇨🇫|🇨🇬
🇨🇭|🇨🇮|🇨🇰|🇨🇱|🇨🇲|🇨🇳|🇨🇴|🇨🇵|🇨🇶|🇨🇷|🇨🇺|🇨🇻|🇨🇼|🇨🇽|🇨🇾|🇨🇿|🇩🇪|🇩🇬|🇩🇯|🇩🇰|🇩🇲|🇩🇴|🇩🇿|🇪🇦|🇪🇨|🇪🇪|🇪🇬|🇪🇭|🇪🇷|🇪🇸|🇪🇹|🇪🇺
🇫🇮|🇫🇯|🇫🇰|🇫🇲|🇫🇴|🇫🇷|🇬🇦|🇬🇧|🇬🇩|🇬🇪|🇬🇫|🇬🇬|🇬🇭|🇬🇮|🇬🇱|🇬🇲|🇬🇳|🇬🇵|🇬🇶|🇬🇷|🇬🇸|🇬🇹|🇬🇺|🇬🇼|🇬🇾|🇭🇰|🇭🇲|🇭🇳|🇭🇷|🇭🇹|🇭🇺|🇮🇨
🇮🇩|🇮🇪|🇮🇱|🇮🇲|🇮🇳|🇮🇴|🇮🇶|🇮🇷|🇮🇸|🇮🇹|🇯🇪|🇯🇲|🇯🇴|🇯🇵|🇰🇪|🇰🇬|🇰🇭|🇰🇮|🇰🇲|🇰🇳|🇰🇵|🇰🇷|🇰🇼|🇰🇾|🇰🇿|🇱🇦|🇱🇧|🇱🇨|🇱🇮|🇱🇰|🇱🇷|🇱🇸
🇱🇹|🇱🇺|🇱🇻|🇱🇾|🇲🇦|🇲🇨|🇲🇩|🇲🇪|🇲🇫|🇲🇬|🇲🇭|🇲🇰|🇲🇱|🇲🇲|🇲🇳|🇲🇴|🇲🇵|🇲🇶|🇲🇷|🇲🇸|🇲🇹|🇲🇺|🇲🇻|🇲🇼|🇲🇽|🇲🇾|🇲🇿|🇳🇦|🇳🇨|🇳🇪|🇳🇫|🇳🇬
🇳🇮|🇳🇱|🇳🇴|🇳🇵|🇳🇷|🇳🇺|🇳🇿|🇴🇲|🇵🇦|🇵🇪|🇵🇫|🇵🇬|🇵🇭|🇵🇰|🇵🇱|🇵🇲|🇵🇳|🇵🇷|🇵🇸|🇵🇹|🇵🇼|🇵🇾|🇶🇦|🇷🇪|🇷🇴|🇷🇸|🇷🇺|🇷🇼|🇸🇦|🇸🇧|🇸🇨|🇸🇩
🇸🇪|🇸🇬|🇸🇭|🇸🇮|🇸🇯|🇸🇰|🇸🇱|🇸🇲|🇸🇳|🇸🇴|🇸🇷|🇸🇸|🇸🇹|🇸🇻|🇸🇽|🇸🇾|🇸🇿|🇹🇦|🇹🇨|🇹🇩|🇹🇫|🇹🇬|🇹🇭|🇹🇯|🇹🇰|🇹🇱|🇹🇲|🇹🇳|🇹🇴|🇹🇷|🇹🇹|🇹🇻
🇹🇼|🇹🇿|🇺🇦|🇺🇬|🇺🇲|🇺🇳|🇺🇸|🇺🇾|🇺🇿|🇻🇦|🇻🇨|🇻🇪|🇻🇬|🇻🇮|🇻🇳|🇻🇺|🇼🇫|🇼🇸|🇽🇰|🇾🇪|🇾🇹|🇿🇦|🇿🇲|🇿🇼|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🏴󠁧󠁢󠁳󠁣󠁴󠁿|🏴󠁧󠁢󠁷󠁬󠁳󠁿$emoji$, '[|[:space:]]+');

create table public.study_reactions (
  user_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid not null references public.study_threads(id) on delete cascade,
  reply_id uuid references public.study_replies(id) on delete cascade,
  message_id uuid generated always as (coalesce(reply_id, thread_id)) stored,
  emoji text not null references public.study_emoji_catalog(emoji),
  primary key (thread_id, message_id, emoji, user_id)
);

create table public.study_emoji_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null references public.study_emoji_catalog(emoji),
  uses bigint not null default 1 check (uses > 0),
  last_used timestamptz not null default now(),
  primary key (user_id, emoji)
);

alter table public.study_student_ids enable row level security;
alter table public.study_emoji_catalog enable row level security;
alter table public.study_reactions enable row level security;
alter table public.study_emoji_usage enable row level security;
revoke all on public.study_student_ids, public.study_emoji_catalog, public.study_reactions, public.study_emoji_usage
  from public, anon, authenticated;
grant select on public.study_student_ids, public.study_emoji_usage to authenticated;
create policy study_student_id_self on public.study_student_ids for select to authenticated using (user_id = (select auth.uid()));
create policy study_emoji_usage_self on public.study_emoji_usage for select to authenticated using (user_id = (select auth.uid()));

create function public.study_set_student_id(value text) returns text
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := auth.uid(); normalized text := upper(btrim(value));
begin
  if owner_id is null then raise insufficient_privilege; end if;
  if normalized is null or normalized !~ '^[0-9]{4}[0-9A-Z][0-9]{3,4}$' then
    raise exception 'Invalid student number' using errcode = '22023';
  end if;
  insert into public.study_student_ids(user_id, student_id) values (owner_id, normalized)
    on conflict (user_id) do update set student_id = excluded.student_id;
  return normalized;
end;
$$;

create function public.study_discussion_people(people uuid[]) returns table(id uuid, is_admin boolean, student_id text)
language sql stable security definer set search_path = '' as $$
  select p.id, m.user_id is not null, case when viewer.user_id is not null then s.student_id end
  from (select distinct unnest(people[1:50]) as id) requested
  join public.study_profiles p on p.id = requested.id
  left join public.study_moderators m on m.user_id = p.id
  left join public.study_student_ids s on s.user_id = p.id and (
    exists (select 1 from public.study_threads t where t.author_id = p.id and t.hidden_at is null and t.deleted_at is null)
    or exists (select 1 from public.study_replies r join public.study_threads t on t.id = r.thread_id
      where r.author_id = p.id and r.hidden_at is null and r.deleted_at is null and t.hidden_at is null)
  )
  left join public.study_student_ids viewer on viewer.user_id = (select auth.uid());
$$;

create function public.study_require_student() returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare owner_id uuid := auth.uid();
begin
  if not exists (select 1 from public.study_student_ids where user_id = owner_id) then
    raise exception 'Student number required' using errcode = '42501';
  end if;
  return owner_id;
end;
$$;

-- Let existing clients read discussion data and maintain owner checks on every write.
create function public.study_discussion_insert_check() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.study_require_student();
  if tg_table_name = 'study_replies' then
    perform 1 from public.study_threads t where t.id = new.thread_id and t.hidden_at is null
      and (not new.quotes_thread or t.deleted_at is null) for share;
    if not found then raise insufficient_privilege; end if;
    if new.reply_to is not null then
      perform 1 from public.study_replies r where r.id = new.reply_to and r.thread_id = new.thread_id
        and r.hidden_at is null and r.deleted_at is null for share;
      if not found then raise exception 'Reply target unavailable' using errcode = '22023'; end if;
    end if;
  end if;
  return new;
end;
$$;

create trigger study_thread_student before insert on public.study_threads for each row execute function public.study_discussion_insert_check();
create trigger study_reply_student before insert on public.study_replies for each row execute function public.study_discussion_insert_check();
grant insert (reply_to, quotes_thread) on public.study_replies to authenticated;

alter policy threads_solve on public.study_threads
  using (author_id = (select auth.uid()) and hidden_at is null and deleted_at is null
    and exists (select 1 from public.study_student_ids s where s.user_id = (select auth.uid())))
  with check (author_id = (select auth.uid()) and hidden_at is null and deleted_at is null);

create function public.study_reply_position(target_thread uuid, target_reply uuid) returns bigint
language sql stable security invoker set search_path = '' as $$
  select (select count(*) from public.study_replies r where r.thread_id = target_thread
          and (r.created_at, r.id) < (target.created_at, target.id))
  from public.study_replies target where target.id = target_reply and target.thread_id = target_thread;
$$;
revoke execute on function public.study_reply_position(uuid, uuid) from public;
grant execute on function public.study_reply_position(uuid, uuid) to anon, authenticated;

create function public.study_change_message(target_thread uuid, target_reply uuid, new_title text, new_body text, remove_message boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := public.study_require_student();
begin
  if target_reply is null then
    update public.study_threads
      set title = case when remove_message then '此貼文已被刪除' else btrim(new_title) end,
        body = case when remove_message then '此訊息已被刪除' else btrim(new_body) end,
        edited_at = case when remove_message then edited_at else now() end,
        deleted_at = case when remove_message then now() end,
        solved = case when remove_message then false else solved end
      where id = target_thread and author_id = owner_id and hidden_at is null and deleted_at is null
        and (remove_message or (title, body) is distinct from (btrim(new_title), btrim(new_body)));
  else
    perform 1 from public.study_threads where id = target_thread and hidden_at is null for share;
    if not found then return false; end if;
    update public.study_replies
      set body = case when remove_message then '此訊息已被刪除' else btrim(new_body) end,
        edited_at = case when remove_message then edited_at else now() end,
        deleted_at = case when remove_message then now() end
      where id = target_reply and thread_id = target_thread and author_id = owner_id and hidden_at is null and deleted_at is null
        and (remove_message or body is distinct from btrim(new_body));
  end if;
  if not found then return false; end if;
  if remove_message then
    delete from public.study_reactions where thread_id = target_thread and message_id = coalesce(target_reply, target_thread);
  end if;
  return true;
end;
$$;

create function public.study_message_reactions(target_thread uuid, messages uuid[])
returns table(message_id uuid, emoji text, total bigint, reacted boolean)
language sql stable security definer set search_path = '' as $$
  select e.message_id, e.emoji, count(*), bool_or(e.user_id = (select auth.uid()))
  from public.study_reactions e
  join public.study_threads t on t.id = e.thread_id and t.hidden_at is null
  left join public.study_replies r on r.id = e.reply_id
  where e.thread_id = target_thread and e.message_id = any(messages[1:25])
    and ((e.reply_id is null and t.deleted_at is null) or (r.id is not null and r.hidden_at is null and r.deleted_at is null))
  group by e.message_id, e.emoji;
$$;

create function public.study_set_reaction(target_thread uuid, target_reply uuid, chosen_emoji text, add_reaction boolean)
returns table(message_id uuid, emoji text, total bigint, reacted boolean, uses bigint, last_used timestamptz)
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid := public.study_require_student(); target_id uuid := coalesce(target_reply, target_thread);
begin
  perform 1 from public.study_threads t where t.id = target_thread and t.hidden_at is null
    and (target_reply is not null or t.deleted_at is null) for share;
  if not found then raise insufficient_privilege; end if;
  if target_reply is not null then
    perform 1 from public.study_replies r where r.id = target_reply and r.thread_id = target_thread
      and r.hidden_at is null and r.deleted_at is null for share;
    if not found then raise insufficient_privilege; end if;
  end if;
  if not exists (select 1 from public.study_emoji_catalog c where c.emoji = chosen_emoji) then
    raise exception 'Unknown emoji' using errcode = '22023';
  end if;
  if add_reaction then
    insert into public.study_reactions(user_id, thread_id, reply_id, emoji) values (owner_id, target_thread, target_reply, chosen_emoji)
      on conflict on constraint study_reactions_pkey do nothing;
    if found then
      insert into public.study_emoji_usage as u(user_id, emoji) values (owner_id, chosen_emoji)
        on conflict on constraint study_emoji_usage_pkey do update set uses = u.uses + 1, last_used = now();
    end if;
  else
    delete from public.study_reactions e where e.thread_id = target_thread and e.message_id = target_id
      and e.user_id = owner_id and e.emoji = chosen_emoji;
  end if;
  return query select target_id, chosen_emoji,
    (select count(*) from public.study_reactions e where e.thread_id = target_thread and e.message_id = target_id and e.emoji = chosen_emoji),
    exists (select 1 from public.study_reactions e where e.thread_id = target_thread and e.message_id = target_id and e.emoji = chosen_emoji and e.user_id = owner_id),
    (select u.uses from public.study_emoji_usage u where u.user_id = owner_id and u.emoji = chosen_emoji),
    (select u.last_used from public.study_emoji_usage u where u.user_id = owner_id and u.emoji = chosen_emoji);
end;
$$;

revoke execute on function public.study_discussion_insert_check(), public.study_require_student() from public, anon, authenticated;
revoke execute on function public.study_set_student_id(text), public.study_discussion_people(uuid[]),
  public.study_change_message(uuid, uuid, text, text, boolean), public.study_message_reactions(uuid, uuid[]),
  public.study_set_reaction(uuid, uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.study_discussion_people(uuid[]), public.study_message_reactions(uuid, uuid[]) to anon, authenticated;
grant execute on function public.study_set_student_id(text), public.study_change_message(uuid, uuid, text, text, boolean),
  public.study_set_reaction(uuid, uuid, text, boolean) to authenticated;

notify pgrst, 'reload schema';
commit;
