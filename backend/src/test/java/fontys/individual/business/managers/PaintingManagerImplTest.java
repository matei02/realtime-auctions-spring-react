package fontys.individual.business.managers;

import fontys.individual.business.converters.PaintingConverter;
import fontys.individual.business.exceptions.InvalidPaintingException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.domain.classes.Painting;
import fontys.individual.persistence.ArtRepository;
import fontys.individual.persistence.entity.ArtEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaintingManagerImplTest {

    @Mock
    private ArtRepository artRepository;

    @InjectMocks
    private PaintingManagerImpl paintingManager;

    private Painting testPainting;
    private ArtEntity testEntity;

    @BeforeEach
    public void setUp() {
        testPainting = new Painting();
        testPainting.setName("Test");
        testPainting.setPrice(100);
        testPainting.setLength(10);
        testPainting.setWidth(20);
        testPainting.setImage(null);
        testPainting.setDescription("description");
        testEntity = PaintingConverter.convertToArtEntity(testPainting);
    }

    @Test
    public void testCreatePainting() {
        when(artRepository.findAll()).thenReturn(Collections.emptyList());
        when(artRepository.save(any(ArtEntity.class))).thenReturn(testEntity);

        Long result = paintingManager.createPainting(testPainting);

        assertEquals(testEntity.getId(), result);
    }

    @Test
    public void testCreatePainting_InvalidPaintingException() {
        Painting painting = new Painting();
        painting.setName("painting");
        painting.setPrice(200);
        painting.setLength(50);
        painting.setWidth(50);
        painting.setImage(new Byte[] {0, 1, 12});
        painting.setDescription("description");

        when(artRepository.findAll()).thenReturn(Collections.singletonList(testEntity));

        assertThrows(InvalidPaintingException.class, () -> paintingManager.createPainting(painting));
    }

    @Test
    public void testDeletePainting() {
        doNothing().when(artRepository).deleteById(anyLong());

        assertDoesNotThrow(() -> paintingManager.deletePainting(1L));
    }

    @Test
    public void testGetPaintingById() {
        when(artRepository.findById(anyLong())).thenReturn(Optional.of(testEntity));

        Painting result = paintingManager.getPaintingById(1L);

        assertEquals(testPainting, result);
    }

    @Test
    public void testGetPaintingById_NotFoundException() {
        when(artRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> paintingManager.getPaintingById(1L));
    }

    @Test
    public void testGetAllPaintings() {
        when(artRepository.findAll()).thenReturn(Collections.singletonList(testEntity));

        assertEquals(1, paintingManager.getAllPaintings().size());
    }

    @Test
    public void testUpdatePainting() {
        when(artRepository.findById(anyLong())).thenReturn(Optional.of(testEntity));
        when(artRepository.save(any(ArtEntity.class))).thenReturn(testEntity);

        assertDoesNotThrow(() -> paintingManager.updatePainting(1L, testPainting));
    }

    @Test
    public void testUpdatePainting_NotFound() {
        when(artRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> paintingManager.updatePainting(1L, testPainting));
    }

}