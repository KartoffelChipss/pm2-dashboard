import { useQuery } from '@tanstack/react-query';
import Page from '../Page';
import { PM2AppInfo } from '../../../../types/pm2';
import Layout from '../../layout/Layout';

const HomePage = () => {
    const { data: apps } = useQuery<PM2AppInfo[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const response = await fetch('/api/apps');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    });

    return (
        <Page title="Home - PM2 Dashboard">
            <Layout activeSection="home">
                <h1>Welcome to the Home Page</h1>
                <ul>
                    {apps?.map((app) => (
                        <li key={app.pm_id}>{app.name}</li>
                    ))}
                </ul>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi maximus metus eu
                    leo pellentesque tempor. Donec ullamcorper ante sed pharetra pharetra. Praesent
                    turpis erat, pretium ac sapien vel, iaculis luctus dui. Cras lobortis dictum
                    magna id egestas. Curabitur cursus ante sed egestas tempus. Nullam a ullamcorper
                    dui. Pellentesque molestie nec odio sed mollis. Suspendisse nec nisi sed odio
                    venenatis tempus. Donec fermentum imperdiet dolor, ac bibendum nisi porta nec.
                    Sed ac tincidunt diam. Nullam finibus faucibus semper. Proin suscipit tincidunt
                    risus, sit amet bibendum est. Morbi laoreet lacus turpis, sed molestie nulla
                    molestie at. Sed ullamcorper scelerisque aliquet. Aliquam erat volutpat.
                    Vestibulum ultrices velit neque, sit amet fringilla erat ultricies vel. Sed diam
                    neque, venenatis vel turpis a, finibus semper purus. Morbi sagittis eget tortor
                    in sodales. Etiam convallis eros blandit, accumsan nunc id, iaculis massa.
                    Nullam eu mi tellus. Cras a pretium ipsum. Suspendisse pharetra dolor id augue
                    convallis, id dapibus lectus viverra. Duis aliquam augue vel congue aliquam.
                    Donec egestas mauris pellentesque nisl varius semper. Vestibulum nunc ipsum,
                    interdum ac nisi eget, volutpat aliquam magna. Sed et orci ipsum. Quisque quis
                    turpis libero. Ut non pulvinar ante. Duis ultrices nibh sed ex maximus, a
                    sagittis orci maximus. Nunc at felis magna. Donec consequat enim justo, vitae
                    fringilla nulla mollis in. Ut porta eu justo vel malesuada. In finibus augue id
                    dui viverra eleifend at ac dolor. Nulla molestie sed erat quis aliquam.
                    Phasellus vel erat nisl. Nullam ut fermentum metus, id aliquet lacus. Nunc eget
                    erat nisl. Duis malesuada orci non ante blandit, a volutpat metus viverra. Nam
                    vitae arcu non mi hendrerit pellentesque sit amet et felis. Etiam vitae porta
                    velit. Ut pulvinar velit viverra lorem mattis, vel accumsan nisi placerat. Etiam
                    in blandit turpis, a dignissim mauris. Phasellus vestibulum luctus turpis, quis
                    commodo mi porta ut. Nam rhoncus eu erat a facilisis. Quisque varius mollis
                    convallis. Aliquam vitae erat quis risus dapibus pretium. Curabitur quis urna
                    pulvinar, luctus diam eget, accumsan eros. Praesent mauris ligula, tempor id
                    augue ut, euismod aliquam leo. Duis bibendum vestibulum lorem, id auctor risus
                    finibus vel. Sed eget sem nec ligula dignissim interdum. Pellentesque volutpat
                    mi tortor, eget egestas enim imperdiet at. Nunc ut turpis sodales purus porta
                    bibendum. Sed in accumsan eros. Nulla ullamcorper viverra felis vitae tempus. In
                    cursus condimentum turpis, ac finibus nibh rutrum eu. Sed felis sapien, luctus
                    nec faucibus id, sodales non risus. Donec porttitor odio vitae nisi elementum
                    pellentesque. Cras ut ligula vel arcu rutrum ornare efficitur vitae ipsum.
                    Mauris nec neque sem. Mauris nunc eros, viverra nec cursus non, scelerisque et
                    libero. Donec quis mauris nec augue eleifend tristique sit amet mollis diam.
                    Nulla massa eros, ultrices sed facilisis a, hendrerit id enim. Aenean fringilla
                    neque risus, sit amet tincidunt enim varius sed. Pellentesque habitant morbi
                    tristique senectus et netus et malesuada fames ac turpis egestas. In ut ultrices
                    mi. Morbi rhoncus odio enim, vel aliquet dolor laoreet sit amet. Etiam in dolor
                    nec elit fermentum ultrices a id sapien. Aenean semper lacus et diam feugiat
                    pulvinar eu consectetur dolor. Vestibulum viverra magna a nulla volutpat
                    malesuada. Phasellus accumsan rhoncus bibendum. Quisque sodales non nisl vel
                    lacinia. Phasellus egestas est mi, nec maximus lorem elementum vitae. Sed
                    bibendum ut augue nec vestibulum. Orci varius natoque penatibus et magnis dis
                    parturient montes, nascetur ridiculus mus. Praesent interdum purus sed
                    consectetur scelerisque. Proin iaculis, mauris aliquet cursus feugiat, ex elit
                    rhoncus ex, nec imperdiet tellus purus vitae mi. Suspendisse non libero
                    fringilla, commodo tellus et, bibendum leo. Quisque cursus nibh eu urna luctus,
                    a ornare tortor lobortis. Donec et aliquam justo. Praesent a mollis nisl, ac
                    blandit nibh. In vitae nisl elit. Aenean vel scelerisque neque. Sed efficitur
                    pharetra sodales. Nunc pretium neque id lectus viverra tristique. Mauris mattis
                    odio eu turpis pharetra pulvinar. Vestibulum pharetra purus tellus, vitae
                    placerat risus laoreet a. Aliquam sollicitudin, justo non maximus tincidunt,
                    enim nibh maximus tellus, nec iaculis quam lacus dignissim sapien. Suspendisse
                    fermentum porttitor fermentum. Duis venenatis urna massa, id laoreet mauris
                    mollis et. Curabitur iaculis, ante eget gravida posuere, felis velit elementum
                    lacus, vitae vulputate erat sapien sed quam. Fusce semper placerat sapien sit
                    amet gravida. Proin tincidunt pharetra imperdiet. Proin tempor tellus enim,
                    aliquam semper elit lacinia in. Phasellus dapibus rutrum nunc sit amet pretium.
                    Sed ut tortor vel nulla cursus laoreet in vel quam. Mauris scelerisque dapibus
                    tortor nec cursus. Nam a lorem quis purus efficitur convallis a ut mi. Aenean
                    vitae elementum neque. Proin semper nec massa eget cursus. Pellentesque luctus
                    enim eget lectus fermentum condimentum. Etiam consequat nisi ut tortor porta
                    lacinia. Aliquam non tristique mauris. Pellentesque sit amet dapibus arcu. Donec
                    id condimentum metus, vel rhoncus odio. Cras ex orci, convallis in metus id,
                    vehicula interdum tellus. Curabitur dapibus elit a pretium ornare. Maecenas
                    tincidunt, tellus sit amet eleifend ultricies, sapien dui imperdiet urna, sit
                    amet vulputate risus dolor ut mauris. Ut eu lacus at arcu eleifend sollicitudin.
                    Aenean rutrum faucibus facilisis. In erat arcu, placerat vitae luctus at,
                    molestie sed massa. Curabitur dapibus finibus varius. Nullam porta ultrices
                    eros, et eleifend sapien maximus vel. Mauris felis lorem, convallis vitae dui
                    et, tincidunt malesuada urna. Praesent quis commodo enim. Nullam vel porta
                    neque. Proin quis magna sapien. Curabitur eros risus, tempor quis ultricies
                    vitae, mollis at diam. Maecenas tincidunt maximus odio, et posuere ante rutrum
                    in. Integer vel vestibulum purus. Pellentesque nibh quam, consectetur sed ante
                    a, vulputate egestas dolor. Nunc risus enim, auctor nec arcu vitae, commodo
                    cursus risus. Maecenas a lacus vitae turpis porttitor commodo. Suspendisse arcu
                    orci, cursus ut fringilla vel, egestas a risus. Nulla euismod ultricies velit,
                    quis tempor erat mattis nec. Aliquam enim nisi, finibus vel feugiat id,
                    ullamcorper ut eros. Suspendisse potenti. In lacus nunc, dignissim at tortor sit
                    amet, tristique ultricies risus. Integer arcu neque, ultricies sit amet lectus
                    ac, placerat dictum augue. Quisque pretium erat sed tempus pellentesque. Quisque
                    hendrerit finibus quam, ac sodales metus vehicula vel. Phasellus et mauris erat.
                    Aliquam sit amet rhoncus quam. Sed cursus pellentesque orci ut fringilla.
                    Vestibulum feugiat porta egestas. Nunc eu tristique arcu, at elementum dui. Cras
                    laoreet lorem in eleifend hendrerit. In eget imperdiet magna. Orci varius
                    natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Class
                    aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                    himenaeos. Pellentesque id finibus quam, at commodo metus. Nam in scelerisque
                    erat, in consectetur urna. Etiam tempor neque vitae arcu pellentesque blandit.
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
                    curae; Aenean suscipit lorem dolor. Sed nec nulla rutrum, scelerisque ligula
                    quis, lobortis ligula. Vivamus blandit elementum lacus quis sodales. Aliquam
                    vulputate egestas mauris, at sagittis quam accumsan fringilla. Nam eget auctor
                    nisl, eget mattis velit. Ut eu viverra urna. Nulla luctus risus eget est
                    bibendum semper. Sed vel est at dui tempus porttitor ut ac purus. Donec lorem
                    mauris, pulvinar vel ultricies nec, faucibus ut lorem. Sed lobortis nunc odio,
                    nec mattis orci scelerisque ut. Proin consequat odio mauris, sit amet euismod
                    massa convallis nec. Vivamus luctus odio a pulvinar pharetra. Nulla ultrices
                    lorem aliquet mollis volutpat. Nunc at nulla quis elit pretium commodo. Cras
                    ullamcorper maximus nibh nec ultrices. Phasellus commodo id augue volutpat
                    dapibus. Mauris turpis eros, malesuada luctus sodales sit amet, viverra vel
                    nisl. Aenean commodo metus vulputate turpis hendrerit posuere. Donec quis lectus
                    nec nulla lacinia condimentum id id urna. Curabitur efficitur iaculis dolor, in
                    lacinia dolor porta id. Mauris auctor odio magna, a tincidunt leo lobortis non.
                    Praesent turpis massa, commodo nec tincidunt ullamcorper, maximus ac lorem.
                    Vestibulum interdum lorem non sagittis dapibus. In hac habitasse platea
                    dictumst. Nunc non ipsum sed nibh pharetra auctor. Nam pretium orci a ultrices
                    euismod. Nulla non varius dolor. Vestibulum justo ante, mollis sit amet aliquet
                    ut, congue sit amet lacus. Sed lacinia sodales risus, a porta nisi rutrum a.
                    Morbi a nulla interdum, pellentesque est eget, sodales enim. In vel pellentesque
                    enim, sit amet gravida leo. Morbi quis sapien orci. Aenean feugiat at nisl nec
                    mollis. Nunc porta nunc eget nisi cursus sollicitudin. Etiam tempor est ut
                    scelerisque condimentum. Nunc auctor at sapien vel condimentum. Maecenas in nisl
                    non mauris mattis commodo. In hendrerit mi arcu, quis faucibus lorem ullamcorper
                    ut. Praesent fringilla justo non orci dignissim, vitae volutpat diam ornare.
                    Suspendisse potenti. Fusce nec magna ac lacus vestibulum efficitur nec vitae
                    sapien. Morbi ut ipsum faucibus, placerat mi ut, malesuada leo. Cras convallis
                    magna eget ultrices mollis. Aenean egestas, ante a ullamcorper aliquam, turpis
                    turpis ullamcorper massa, tincidunt tempor risus felis nec quam. Mauris id
                    suscipit felis. Vivamus tempus tempus enim, pulvinar fermentum dui tempor sed.
                    Donec ullamcorper pulvinar leo. Vivamus condimentum est tellus, vitae varius ex
                    luctus vitae. Fusce condimentum libero sed dictum efficitur. Sed eget sodales
                    enim. Duis blandit magna et nunc fermentum consectetur. Curabitur ac efficitur
                    leo. Sed vulputate felis nec arcu dignissim semper. Aliquam sagittis luctus
                    risus sed vestibulum. Curabitur accumsan cursus lectus ac cursus. Aliquam
                    convallis elementum magna, vitae tristique diam. Cras lacus enim, egestas
                    faucibus faucibus nec, aliquet elementum dui. Sed commodo pulvinar ante sed
                    bibendum. Maecenas est purus, bibendum ut bibendum sed, luctus et nisl.
                    Curabitur lobortis auctor congue. Morbi sit amet condimentum turpis. Orci varius
                    natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                    Quisque sollicitudin ut purus quis facilisis. Nam non enim eget est viverra
                    dignissim. Nam vulputate ante eu erat molestie, vitae tempor purus ultricies.
                    Nunc ac sagittis massa. Vestibulum vel nisi mi. Mauris ut arcu a justo eleifend
                    convallis vitae gravida enim. Quisque auctor orci eu elit mollis pharetra.
                    Mauris porta ipsum ut nisi vestibulum sodales. In viverra ornare magna, vel
                    volutpat metus convallis vel. Aenean semper dapibus velit at pellentesque.
                    Pellentesque sit amet turpis at lacus ornare malesuada vitae eget diam. Aliquam
                    libero quam, tincidunt sed condimentum cursus, sagittis nec erat. Maecenas quis
                    velit quis ligula tempus lacinia sit amet sed enim. Phasellus volutpat quam sed
                    dictum accumsan. Vivamus non est et ipsum commodo porttitor. Etiam semper
                    ultrices ligula et consectetur. Fusce vitae augue quis purus pellentesque
                    finibus ac at metus. In euismod congue est, sit amet lacinia risus vehicula et.
                    Nunc fringilla risus eu dui feugiat, vitae efficitur tellus consequat. Curabitur
                    urna elit, tincidunt vitae congue in, accumsan in lectus. Sed sed eros elit.
                    Fusce facilisis metus felis, eget egestas nunc iaculis ac. Ut iaculis elit at
                    nunc molestie finibus. Vivamus sit amet nunc id metus sagittis viverra. Interdum
                    et malesuada fames ac ante ipsum primis in faucibus. Donec quis enim ut erat
                    feugiat tempor. Donec non pretium felis. Aenean tortor dolor, rhoncus nec
                    sodales quis, elementum nec risus. Nulla vestibulum nulla eu arcu mattis
                    aliquam. Aliquam vel metus vel velit ullamcorper mattis. Fusce volutpat metus
                    dui, nec ornare lacus convallis vel. Aliquam iaculis viverra metus, ac
                    sollicitudin sapien semper ut. Phasellus id dapibus tortor. Pellentesque auctor
                    faucibus fermentum. Etiam rutrum, quam vel dignissim sagittis, ante ipsum tempor
                    felis, a scelerisque sapien lorem eu ipsum. Quisque tempus nulla sem, vel
                    euismod diam semper nec.
                </p>
            </Layout>
        </Page>
    );
};

export default HomePage;
